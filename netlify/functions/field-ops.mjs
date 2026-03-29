import { getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';

const ACTIVE_BOARD_SLUG = process.env.FIELD_OPS_ACTIVE_SLUG ?? 'apr-2026-field-test';
const ACTIVE_BOARD_TITLE =
  process.env.FIELD_OPS_ACTIVE_TITLE ?? 'Universal Hunt Trip Board — April 2026 Field Test';
const TRIP_CODE = process.env.FIELD_OPS_TRIP_CODE ?? 'hunt';
const ALLOWED_PARTICIPANTS = (process.env.FIELD_OPS_PARTICIPANTS ?? 'Mike,Teammate 2,Teammate 3')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

const ACTIVE_ROUTE_KEYS = [
  'citywalk',
  'diagon-alley',
  'minion-mischief',
  'springfield-side-quest',
];

const FILESYSTEM_STORE_DIR = '/tmp/universal-hunt-field-ops';
const FILESYSTEM_STORE_FILE = `${FILESYSTEM_STORE_DIR}/store.json`;
const FILESYSTEM_ATTACHMENTS_DIR = `${FILESYSTEM_STORE_DIR}/attachments`;
const BLOBS_STATE_STORE_NAME = 'field-ops-state';
const BLOBS_ATTACHMENTS_STORE_NAME = 'field-ops-attachments';
const BLOBS_STATE_KEY = `${ACTIVE_BOARD_SLUG}/store.json`;
const STORE_SCHEMA_VERSION = 2;

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 3;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_NOTES_LENGTH = 2000;
const MAX_ACTIVITY_ENTRIES = 200;
const DUPLICATE_UPLOAD_WINDOW_MS = 1000 * 60 * 10;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_TASK_TYPES = new Set(['photo', 'coordinate', 'clue-test', 'note']);
const ALLOWED_PRIORITIES = new Set(['must', 'should', 'bonus']);
const ALLOWED_STATUSES = new Set(['open', 'in-progress', 'done']);

const SEEDED_TASKS = [
  ['citywalk', 'Capture updated arrival hero photo', 'photo', 'must', 'Take a landscape photo near the CityWalk globe area for home screen hero imagery.'],
  ['citywalk', 'Verify Cowfish coordinate pin', 'coordinate', 'must', 'Confirm storefront entrance coordinate and note if map pin should move.'],
  ['citywalk', 'Test lagoon clue readability at dusk', 'clue-test', 'should', 'Run lagoon clue copy during evening lighting and record any confusing wording.'],
  ['diagon-alley', 'Validate dragon visibility clue', 'clue-test', 'must', 'Confirm clue leads teams to Gringotts dragon quickly without extra hints.'],
  ['diagon-alley', 'Capture storefront detail photos', 'photo', 'must', 'Collect close-up photos for Menagerie and Knockturn-facing details.'],
  ['diagon-alley', 'Re-pin Leaky Cauldron sign anchor', 'coordinate', 'should', 'Use pinpoint mode and capture exact sign location with notes about crowd flow.'],
  ['minion-mischief', 'Update Minion Land atmosphere shots', 'photo', 'should', 'Capture bright daytime and shaded variant for app card imagery.'],
  ['minion-mischief', 'Check clue order for team split path', 'clue-test', 'must', 'Run clue sequence with two people in parallel to test branch flexibility.'],
  ['minion-mischief', 'Coordinate check for landmark icon', 'coordinate', 'should', 'Verify icon location against in-map labels and update if offset by more than 10m.'],
  ['springfield-side-quest', 'Capture Simpsons-themed clue support photos', 'photo', 'must', 'Take signage and storefront photo options for clue and hint cards.'],
  ['springfield-side-quest', 'Verify Duff area pin accuracy', 'coordinate', 'must', 'Confirm the location point players should stand at for clue completion.'],
  ['springfield-side-quest', 'Log any confusing clue language', 'note', 'bonus', 'Capture rough notes for clues that need simpler wording on first read.'],
];

export default async (request) => {
  try {
    const storeContext = await loadStoreContext();
    const store = storeContext.store;
    const { endpoint, id } = parseEndpoint(request.url);

    purgeExpiredSessions(store);

    if (request.method === 'GET' && endpoint === '/board') {
      return json(getBoardResponse(store));
    }

    if (request.method === 'POST' && endpoint === '/session') {
      const payload = await request.json();
      const session = createSession(store, payload);
      await persistStore(storeContext);
      return json(session);
    }

    if (request.method === 'GET' && endpoint === '/tasks') {
      const session = requireSession(request, store);
      return json({ tasks: listBoardTasks(store, session.boardId) });
    }

    if (request.method === 'POST' && endpoint === '/tasks/update' && id) {
      const session = requireSession(request, store);
      const payload = await request.json();
      updateTask(store, session, id, payload);
      await persistStore(storeContext);
      return json({ taskId: id });
    }

    if (request.method === 'POST' && endpoint === '/tasks/upload' && id) {
      const session = requireSession(request, store);
      const payload = await request.formData();
      const uploadResult = await uploadAttachment(storeContext, store, session, id, payload);

      try {
        await persistStore(storeContext);
      } catch (error) {
        await rollbackUploadedAttachment(storeContext, uploadResult.cleanupBlobKey);
        throw error;
      }

      return json({ attachment: uploadResult.attachment });
    }

    if (request.method === 'GET' && endpoint === '/gallery') {
      const session = requireSession(request, store);
      return json({ attachments: listBoardAttachments(store, session.boardId) });
    }

    if (request.method === 'GET' && endpoint === '/attachments' && id) {
      requireSession(request, store);
      return await sendAttachment(storeContext, store, id);
    }

    if (request.method === 'DELETE' && endpoint === '/attachments' && id) {
      const session = requireSession(request, store);
      const removedAttachment = deleteAttachment(store, session, id);
      await persistStore(storeContext);
      await finalizeDeletedAttachment(storeContext, removedAttachment);
      return json({ attachmentId: id });
    }

    if (request.method === 'GET' && endpoint === '/activity') {
      const session = requireSession(request, store);
      return json({ updates: listBoardUpdates(store, session.boardId) });
    }

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    const status = error instanceof FieldOpsError ? error.status : 400;
    return json({ error: message }, status);
  }
};

class FieldOpsError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function getBoardResponse(store) {
  return {
    board: {
      id: store.board.id,
      slug: store.board.slug,
      title: store.board.title,
      isActive: store.board.isActive,
      routes: store.board.routes,
    },
    participants: store.participants,
  };
}

function createSession(store, payload) {
  const slug = payload?.slug;
  const participantName = payload?.participantName;
  const tripCode = payload?.tripCode;

  if (slug !== store.board.slug) {
    throw new FieldOpsError('Invalid board slug');
  }

  if (!participantName || !tripCode) {
    throw new FieldOpsError('Missing participant or trip code');
  }

  const allowed = store.participants.find(
    (participant) => participant.displayName === participantName && participant.isActive,
  );

  if (!allowed) {
    throw new FieldOpsError('Participant name is not approved for this board');
  }

  if (hashTripCode(tripCode) !== store.board.tripCodeHash) {
    throw new FieldOpsError('Trip code is invalid');
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  store.sessions.push({
    id: randomUUID(),
    boardId: store.board.id,
    participantName,
    sessionToken: token,
    expiresAt,
  });

  return {
    board: {
      id: store.board.id,
      slug: store.board.slug,
      title: store.board.title,
      isActive: store.board.isActive,
      routes: store.board.routes,
    },
    participantName,
    sessionToken: token,
  };
}

function requireSession(request, store) {
  const token = request.headers.get('x-field-ops-session');

  if (!token) {
    throw new FieldOpsError('Missing session token', 401);
  }

  const active = store.sessions.find((session) => session.sessionToken === token);

  if (!active || new Date(active.expiresAt).getTime() <= Date.now()) {
    throw new FieldOpsError('Session expired or invalid. Please re-enter the trip code.', 401);
  }

  return {
    boardId: active.boardId,
    participantName: active.participantName,
  };
}

function listBoardTasks(store, boardId) {
  return store.tasks
    .filter((task) => task.tripBoardId === boardId)
    .sort((a, b) => {
      if (a.routeKey === b.routeKey) {
        return a.title.localeCompare(b.title);
      }
      return a.routeKey.localeCompare(b.routeKey);
    });
}

function listBoardAttachments(store, boardId) {
  return store.attachments
    .filter((attachment) => attachment.tripBoardId === boardId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublicAttachment);
}

function listBoardUpdates(store, boardId) {
  return store.updates
    .filter((entry) => entry.tripBoardId === boardId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ACTIVITY_ENTRIES)
    .map(toPublicUpdate);
}

function updateTask(store, session, taskId, payload) {
  const task = store.tasks.find((entry) => entry.id === taskId && entry.tripBoardId === session.boardId);

  if (!task) {
    throw new FieldOpsError('Task not found', 404);
  }

  if (payload.status !== undefined) {
    if (!ALLOWED_STATUSES.has(payload.status)) {
      throw new FieldOpsError('Invalid status');
    }
    task.status = payload.status;
  }

  if (payload.notes !== undefined) {
    const nextNotes = String(payload.notes);
    if (nextNotes.length > MAX_NOTES_LENGTH) {
      throw new FieldOpsError(`Notes too long. Max ${MAX_NOTES_LENGTH} characters.`);
    }
    task.notes = nextNotes;
  }

  if (payload.assignedToName !== undefined) {
    if (payload.assignedToName === null || payload.assignedToName === '') {
      task.assignedToName = null;
    } else {
      const allowed = store.participants.find(
        (participant) =>
          participant.displayName === payload.assignedToName && participant.isActive,
      );

      if (!allowed) {
        throw new FieldOpsError('Assigned participant is not allowed');
      }

      task.assignedToName = payload.assignedToName;
    }
  }

  task.updatedByName = session.participantName;
  task.updatedAt = new Date().toISOString();
  pushActivityUpdate(store, {
    tripBoardId: session.boardId,
    taskId,
    action: 'task-update',
    byName: session.participantName,
    createdAt: task.updatedAt,
    routeKey: task.routeKey,
    taskTitle: task.title,
  });
}

async function uploadAttachment(storeContext, store, session, taskId, formData) {
  const task = store.tasks.find((entry) => entry.id === taskId && entry.tripBoardId === session.boardId);

  if (!task) {
    throw new FieldOpsError('Task not found for upload', 404);
  }

  const file = formData.get('file');
  const captionValue = formData.get('caption');

  if (!(file instanceof File)) {
    throw new FieldOpsError('Upload requires an image file');
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new FieldOpsError('Unsupported file type. Use JPG, PNG, or WEBP');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new FieldOpsError('File is too large. Max upload is 8MB');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentHash = createHash('sha256').update(bytes).digest('hex');
  const existing = findRecentDuplicateAttachment(store, session, task, contentHash);

  if (existing) {
    return { attachment: toPublicAttachment(existing), cleanupBlobKey: null };
  }

  const extension = file.name.includes('.') ? file.name.split('.').at(-1) : 'jpg';
  const attachmentId = randomUUID();
  const storageFilename = `${attachmentId}.${safeExtension(extension)}`;
  const caption =
    typeof captionValue === 'string' && captionValue.trim().length > 0
      ? captionValue.trim().slice(0, 240)
      : null;
  const createdAt = new Date().toISOString();

  await writeAttachmentBlob(storeContext, storageFilename, bytes, {
    contentHash,
    filename: file.name,
    mimeType: file.type,
    routeKey: task.routeKey,
    taskId: task.id,
    uploadedByName: session.participantName,
  });

  const attachment = {
    id: attachmentId,
    tripTaskId: task.id,
    tripBoardId: task.tripBoardId,
    routeKey: task.routeKey,
    taskType: task.taskType,
    blobKey: storageFilename,
    filename: file.name,
    mimeType: file.type,
    uploadedByName: session.participantName,
    caption,
    createdAt,
    downloadUrl: `/api/field-ops/attachments/${attachmentId}`,
    contentHash,
  };

  store.attachments.push(attachment);
  pushActivityUpdate(store, {
    tripBoardId: session.boardId,
    taskId,
    action: 'attachment-upload',
    byName: session.participantName,
    createdAt,
    routeKey: task.routeKey,
    taskTitle: task.title,
    attachmentId,
    caption,
  });

  return { attachment: toPublicAttachment(attachment), cleanupBlobKey: storageFilename };
}

async function sendAttachment(storeContext, store, attachmentId) {
  const attachment = store.attachments.find((entry) => entry.id === attachmentId);

  if (!attachment) {
    return json({ error: 'Attachment not found' }, 404);
  }

  const bytes = await readAttachmentBlob(storeContext, attachment.blobKey);

  if (!bytes) {
    return json({ error: 'Attachment file unavailable' }, 404);
  }

  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': attachment.mimeType,
      'Cache-Control': 'private, max-age=300',
      'Content-Disposition': `inline; filename="${attachment.filename}"`,
    },
  });
}

function deleteAttachment(store, session, attachmentId) {
  const index = store.attachments.findIndex(
    (entry) => entry.id === attachmentId && entry.tripBoardId === session.boardId,
  );

  if (index < 0) {
    throw new FieldOpsError('Attachment not found', 404);
  }

  const attachment = store.attachments[index];
  store.attachments.splice(index, 1);

  const task = store.tasks.find((entry) => entry.id === attachment.tripTaskId);
  pushActivityUpdate(store, {
    tripBoardId: session.boardId,
    taskId: attachment.tripTaskId,
    action: 'attachment-delete',
    byName: session.participantName,
    createdAt: new Date().toISOString(),
    routeKey: attachment.routeKey,
    taskTitle: task?.title ?? null,
    attachmentId: attachment.id,
    caption: attachment.caption,
  });

  return attachment;
}

function purgeExpiredSessions(store) {
  const now = Date.now();
  store.sessions = store.sessions.filter(
    (session) => new Date(session.expiresAt).getTime() > now,
  );
}

async function loadStoreContext() {
  if (shouldUseBlobsStorage()) {
    return loadBlobsStoreContext();
  }

  return loadFilesystemStoreContext();
}

async function loadFilesystemStoreContext() {
  await mkdir(FILESYSTEM_STORE_DIR, { recursive: true });

  try {
    const raw = await readFile(FILESYSTEM_STORE_FILE, 'utf-8');
    return {
      mode: 'filesystem',
      store: migrateStore(JSON.parse(raw)),
    };
  } catch {
    const seeded = seedStore();
    await writeFile(FILESYSTEM_STORE_FILE, JSON.stringify(seeded, null, 2), 'utf-8');
    return {
      mode: 'filesystem',
      store: seeded,
    };
  }
}

async function loadBlobsStoreContext() {
  const stateStore = getStore({ name: BLOBS_STATE_STORE_NAME, consistency: 'strong' });
  const attachmentStore = getStore({ name: BLOBS_ATTACHMENTS_STORE_NAME, consistency: 'strong' });
  const entry = await stateStore.getWithMetadata(BLOBS_STATE_KEY, {
    consistency: 'strong',
    type: 'json',
  });

  if (entry) {
    return {
      mode: 'blobs',
      store: migrateStore(entry.data),
      etag: entry.etag,
      stateStore,
      attachmentStore,
    };
  }

  const seeded = seedStore();
  const result = await stateStore.setJSON(BLOBS_STATE_KEY, seeded, {
    metadata: buildStateMetadata(seeded),
    onlyIfNew: true,
  });

  if (!result.modified) {
    return loadBlobsStoreContext();
  }

  return {
    mode: 'blobs',
    store: seeded,
    etag: result.etag,
    stateStore,
    attachmentStore,
  };
}

function migrateStore(store) {
  const boardRoutes = Array.isArray(store.board?.routes) && store.board.routes.length > 0
    ? store.board.routes
    : ACTIVE_ROUTE_KEYS;

  return {
    ...store,
    board: {
      ...store.board,
      routes: boardRoutes,
    },
    participants: Array.isArray(store.participants) ? store.participants : [],
    tasks: Array.isArray(store.tasks) ? store.tasks : [],
    updates: Array.isArray(store.updates)
      ? store.updates.map((entry) => ({
          ...entry,
          routeKey: entry.routeKey ?? null,
          taskTitle: entry.taskTitle ?? null,
          attachmentId: entry.attachmentId ?? null,
          caption: entry.caption ?? null,
        }))
      : [],
    sessions: Array.isArray(store.sessions) ? store.sessions : [],
    attachments: Array.isArray(store.attachments)
      ? store.attachments.map((attachment) => ({
          ...attachment,
          downloadUrl:
            attachment.downloadUrl ?? `/api/field-ops/attachments/${attachment.id}`,
          contentHash: attachment.contentHash ?? null,
        }))
      : [],
  };
}

async function persistStore(storeContext) {
  if (storeContext.mode === 'filesystem') {
    await writeFile(FILESYSTEM_STORE_FILE, JSON.stringify(storeContext.store, null, 2), 'utf-8');
    return;
  }

  const result = await storeContext.stateStore.setJSON(BLOBS_STATE_KEY, storeContext.store, {
    metadata: buildStateMetadata(storeContext.store),
    ...(storeContext.etag ? { onlyIfMatch: storeContext.etag } : { onlyIfNew: true }),
  });

  if (!result.modified) {
    throw new FieldOpsError('Field Ops data changed in another session. Please retry.', 409);
  }

  storeContext.etag = result.etag ?? storeContext.etag;
}

function seedStore() {
  const boardId = randomUUID();
  const participants = ALLOWED_PARTICIPANTS.map((displayName, index) => ({
    id: randomUUID(),
    displayName,
    sortOrder: index + 1,
    isActive: true,
  }));

  const tasks = SEEDED_TASKS.map(([routeKey, title, taskType, priority, instructions]) => {
    if (!ACTIVE_ROUTE_KEYS.includes(routeKey)) {
      throw new Error(`Seeded route key not in board routes: ${routeKey}`);
    }
    if (!ALLOWED_TASK_TYPES.has(taskType)) {
      throw new Error(`Invalid seeded task type: ${taskType}`);
    }
    if (!ALLOWED_PRIORITIES.has(priority)) {
      throw new Error(`Invalid seeded task priority: ${priority}`);
    }

    return {
      id: randomUUID(),
      tripBoardId: boardId,
      routeKey,
      title,
      taskType,
      priority,
      status: 'open',
      instructions,
      assignedToName: null,
      notes: '',
      updatedByName: null,
      updatedAt: new Date().toISOString(),
    };
  });

  return {
    board: {
      id: boardId,
      slug: ACTIVE_BOARD_SLUG,
      title: ACTIVE_BOARD_TITLE,
      tripCodeHash: hashTripCode(TRIP_CODE),
      routes: ACTIVE_ROUTE_KEYS,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    participants,
    tasks,
    attachments: [],
    sessions: [],
    updates: [],
  };
}

function parseEndpoint(url) {
  const pathname = new URL(url).pathname;
  const normalized =
    pathname.replace('/.netlify/functions/field-ops', '').replace('/api/field-ops', '') || '/';

  if (/^\/tasks\/[^/]+\/update$/.test(normalized)) {
    const [, , id] = normalized.split('/');
    return { endpoint: '/tasks/update', id };
  }

  if (/^\/tasks\/[^/]+\/upload$/.test(normalized)) {
    const [, , id] = normalized.split('/');
    return { endpoint: '/tasks/upload', id };
  }

  if (/^\/attachments\/[^/]+$/.test(normalized)) {
    const [, , id] = normalized.split('/');
    return { endpoint: '/attachments', id };
  }

  return { endpoint: normalized, id: null };
}

function findRecentDuplicateAttachment(store, session, task, contentHash) {
  const cutoff = Date.now() - DUPLICATE_UPLOAD_WINDOW_MS;

  return store.attachments.find(
    (attachment) =>
      attachment.tripTaskId === task.id &&
      attachment.tripBoardId === session.boardId &&
      attachment.uploadedByName === session.participantName &&
      attachment.contentHash === contentHash &&
      new Date(attachment.createdAt).getTime() >= cutoff,
  );
}

async function writeAttachmentBlob(storeContext, blobKey, bytes, metadata) {
  if (storeContext.mode === 'filesystem') {
    await mkdir(FILESYSTEM_ATTACHMENTS_DIR, { recursive: true });
    await writeFile(`${FILESYSTEM_ATTACHMENTS_DIR}/${blobKey}`, bytes);
    return;
  }

  const result = await storeContext.attachmentStore.set(blobKey, bytes, {
    metadata,
    onlyIfNew: true,
  });

  if (!result.modified) {
    throw new FieldOpsError('Upload key collision. Please try again.', 409);
  }
}

async function readAttachmentBlob(storeContext, blobKey) {
  if (storeContext.mode === 'filesystem') {
    try {
      return await readFile(`${FILESYSTEM_ATTACHMENTS_DIR}/${blobKey}`);
    } catch {
      return null;
    }
  }

  return storeContext.attachmentStore.get(blobKey, {
    consistency: 'strong',
    type: 'arrayBuffer',
  });
}

async function rollbackUploadedAttachment(storeContext, blobKey) {
  if (!blobKey) {
    return;
  }

  if (storeContext.mode === 'filesystem') {
    try {
      await unlink(`${FILESYSTEM_ATTACHMENTS_DIR}/${blobKey}`);
    } catch {
      // Ignore cleanup failures after a rejected metadata write.
    }
    return;
  }

  try {
    await storeContext.attachmentStore.delete(blobKey);
  } catch {
    // Ignore cleanup failures after a rejected metadata write.
  }
}

async function finalizeDeletedAttachment(storeContext, attachment) {
  if (storeContext.mode === 'filesystem') {
    try {
      await unlink(`${FILESYSTEM_ATTACHMENTS_DIR}/${attachment.blobKey}`);
    } catch {
      // Metadata is already gone, so a missing file is acceptable.
    }
    return;
  }

  try {
    await storeContext.attachmentStore.delete(attachment.blobKey);
  } catch {
    // Metadata is already gone, so an orphaned blob is lower risk than stale metadata.
  }
}

function pushActivityUpdate(
  store,
  { tripBoardId, taskId, action, byName, createdAt, routeKey = null, taskTitle = null, attachmentId = null, caption = null },
) {
  store.updates.push({
    id: randomUUID(),
    tripBoardId,
    taskId,
    action,
    byName,
    createdAt,
    routeKey,
    taskTitle,
    attachmentId,
    caption,
  });
}

function toPublicAttachment(attachment) {
  return {
    id: attachment.id,
    tripTaskId: attachment.tripTaskId,
    tripBoardId: attachment.tripBoardId,
    routeKey: attachment.routeKey,
    taskType: attachment.taskType,
    blobKey: attachment.blobKey,
    filename: attachment.filename,
    mimeType: attachment.mimeType,
    uploadedByName: attachment.uploadedByName,
    caption: attachment.caption,
    createdAt: attachment.createdAt,
    downloadUrl: attachment.downloadUrl,
  };
}

function toPublicUpdate(update) {
  return {
    id: update.id,
    tripBoardId: update.tripBoardId,
    taskId: update.taskId,
    action: update.action,
    byName: update.byName,
    createdAt: update.createdAt,
    routeKey: update.routeKey,
    taskTitle: update.taskTitle,
    attachmentId: update.attachmentId,
    caption: update.caption,
  };
}

function buildStateMetadata(store) {
  return {
    boardId: store.board.id,
    boardSlug: store.board.slug,
    schemaVersion: STORE_SCHEMA_VERSION,
  };
}

function shouldUseBlobsStorage() {
  return process.env.NETLIFY === 'true' && process.env.NETLIFY_LOCAL !== 'true';
}

function safeExtension(extension) {
  return extension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
}

function hashTripCode(code) {
  return createHash('sha256').update(code).digest('hex');
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
