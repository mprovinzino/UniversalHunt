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
const STORE_DIR = '/tmp/universal-hunt-field-ops';
const STORE_FILE = `${STORE_DIR}/store.json`;
const ATTACHMENTS_DIR = `${STORE_DIR}/attachments`;

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 3;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_NOTES_LENGTH = 2000;
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
    const store = await loadStore();
    const { endpoint, id } = parseEndpoint(request.url);

    purgeExpiredSessions(store);

    if (request.method === 'GET' && endpoint === '/board') {
      return json(getBoardResponse(store));
    }

    if (request.method === 'POST' && endpoint === '/session') {
      const payload = await request.json();
      const session = createSession(store, payload);
      await persistStore(store);
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
      await persistStore(store);
      return json({ taskId: id });
    }

    if (request.method === 'POST' && endpoint === '/tasks/upload' && id) {
      const session = requireSession(request, store);
      const payload = await request.formData();
      const attachment = await uploadAttachment(store, session, id, payload);
      await persistStore(store);
      return json({ attachment });
    }

    if (request.method === 'GET' && endpoint === '/gallery') {
      const session = requireSession(request, store);
      const attachments = store.attachments
        .filter((attachment) => attachment.tripBoardId === session.boardId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json({ attachments });
    }

    if (request.method === 'GET' && endpoint === '/attachments' && id) {
      requireSession(request, store);
      return await sendAttachment(store, id);
    }

    if (request.method === 'DELETE' && endpoint === '/attachments' && id) {
      const session = requireSession(request, store);
      await deleteAttachment(store, session, id);
      await persistStore(store);
      return json({ attachmentId: id });
    }

    if (request.method === 'GET' && endpoint === '/activity') {
      const session = requireSession(request, store);
      const updates = store.updates
        .filter((entry) => entry.tripBoardId === session.boardId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 200);
      return json({ updates });
    }

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return json({ error: message }, 400);
  }
};

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
    throw new Error('Invalid board slug');
  }

  if (!participantName || !tripCode) {
    throw new Error('Missing participant or trip code');
  }

  const allowed = store.participants.find(
    (participant) => participant.displayName === participantName && participant.isActive,
  );

  if (!allowed) {
    throw new Error('Participant name is not approved for this board');
  }

  if (hashTripCode(tripCode) !== store.board.tripCodeHash) {
    throw new Error('Trip code is invalid');
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
    throw new Error('Missing session token');
  }

  const active = store.sessions.find((session) => session.sessionToken === token);

  if (!active || new Date(active.expiresAt).getTime() <= Date.now()) {
    throw new Error('Session expired or invalid. Please re-enter the trip code.');
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

function updateTask(store, session, taskId, payload) {
  const task = store.tasks.find((entry) => entry.id === taskId && entry.tripBoardId === session.boardId);

  if (!task) {
    throw new Error('Task not found');
  }

  if (payload.status !== undefined) {
    if (!ALLOWED_STATUSES.has(payload.status)) {
      throw new Error('Invalid status');
    }
    task.status = payload.status;
  }

  if (payload.notes !== undefined) {
    const nextNotes = String(payload.notes);
    if (nextNotes.length > MAX_NOTES_LENGTH) {
      throw new Error(`Notes too long. Max ${MAX_NOTES_LENGTH} characters.`);
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
        throw new Error('Assigned participant is not allowed');
      }

      task.assignedToName = payload.assignedToName;
    }
  }

  task.updatedByName = session.participantName;
  task.updatedAt = new Date().toISOString();
  store.updates.push({
    id: randomUUID(),
    tripBoardId: session.boardId,
    taskId,
    action: 'task-update',
    byName: session.participantName,
    createdAt: task.updatedAt,
  });
}

async function uploadAttachment(store, session, taskId, formData) {
  const task = store.tasks.find((entry) => entry.id === taskId && entry.tripBoardId === session.boardId);

  if (!task) {
    throw new Error('Task not found for upload');
  }

  const file = formData.get('file');
  const captionValue = formData.get('caption');

  if (!(file instanceof File)) {
    throw new Error('Upload requires an image file');
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Unsupported file type. Use JPG, PNG, or WEBP');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File is too large. Max upload is 8MB');
  }

  await mkdir(ATTACHMENTS_DIR, { recursive: true });

  const extension = file.name.includes('.') ? file.name.split('.').at(-1) : 'jpg';
  const attachmentId = randomUUID();
  const storageFilename = `${attachmentId}.${safeExtension(extension)}`;
  const filePath = `${ATTACHMENTS_DIR}/${storageFilename}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  const caption =
    typeof captionValue === 'string' && captionValue.trim().length > 0
      ? captionValue.trim().slice(0, 240)
      : null;
  const createdAt = new Date().toISOString();

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
  };

  store.attachments.push(attachment);
  store.updates.push({
    id: randomUUID(),
    tripBoardId: session.boardId,
    taskId,
    action: 'attachment-upload',
    byName: session.participantName,
    createdAt,
  });

  return attachment;
}

async function sendAttachment(store, attachmentId) {
  const attachment = store.attachments.find((entry) => entry.id === attachmentId);

  if (!attachment) {
    return json({ error: 'Attachment not found' }, 404);
  }

  const filePath = `${ATTACHMENTS_DIR}/${attachment.blobKey}`;

  let bytes;
  try {
    bytes = await readFile(filePath);
  } catch {
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

async function deleteAttachment(store, session, attachmentId) {
  const index = store.attachments.findIndex(
    (entry) => entry.id === attachmentId && entry.tripBoardId === session.boardId,
  );

  if (index < 0) {
    throw new Error('Attachment not found');
  }

  const attachment = store.attachments[index];
  store.attachments.splice(index, 1);

  try {
    await unlink(`${ATTACHMENTS_DIR}/${attachment.blobKey}`);
  } catch {
    // If the file already disappeared we still remove metadata.
  }

  store.updates.push({
    id: randomUUID(),
    tripBoardId: session.boardId,
    taskId: attachment.tripTaskId,
    action: 'attachment-delete',
    byName: session.participantName,
    createdAt: new Date().toISOString(),
  });
}

function purgeExpiredSessions(store) {
  const now = Date.now();
  store.sessions = store.sessions.filter(
    (session) => new Date(session.expiresAt).getTime() > now,
  );
}

async function loadStore() {
  await mkdir(STORE_DIR, { recursive: true });

  try {
    const raw = await readFile(STORE_FILE, 'utf-8');
    return migrateStore(JSON.parse(raw));
  } catch {
    const seeded = seedStore();
    await persistStore(seeded);
    return seeded;
  }
}

function migrateStore(store) {
  return {
    ...store,
    updates: Array.isArray(store.updates) ? store.updates : [],
    sessions: Array.isArray(store.sessions) ? store.sessions : [],
    attachments: Array.isArray(store.attachments) ? store.attachments : [],
  };
}

async function persistStore(store) {
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
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
