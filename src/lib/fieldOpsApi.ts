import type {
  FieldOpsBoardResponse,
  FieldOpsGalleryResponse,
  FieldOpsTasksResponse,
  TripSession,
  TripTaskAttachment,
  FieldOpsTaskStatus,
} from '../types/fieldOps';

const API_BASE = '/api/field-ops';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Unexpected field ops error');
  }

  return payload;
}

function authHeaders(sessionToken: string) {
  return {
    'Content-Type': 'application/json',
    'x-field-ops-session': sessionToken,
  };
}

export async function getBoard(slug: string): Promise<FieldOpsBoardResponse> {
  const response = await fetch(`${API_BASE}/board?slug=${encodeURIComponent(slug)}`);
  return parseResponse<FieldOpsBoardResponse>(response);
}

export async function createSession(
  slug: string,
  participantName: string,
  tripCode: string,
): Promise<TripSession> {
  const response = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug, participantName, tripCode }),
  });

  return parseResponse<TripSession>(response);
}

export async function getTasks(slug: string, sessionToken: string): Promise<FieldOpsTasksResponse> {
  const response = await fetch(`${API_BASE}/tasks?slug=${encodeURIComponent(slug)}`, {
    headers: {
      'x-field-ops-session': sessionToken,
    },
  });

  return parseResponse<FieldOpsTasksResponse>(response);
}

interface UpdateTaskInput {
  status?: FieldOpsTaskStatus;
  notes?: string;
  assignedToName?: string | null;
}

export async function updateTask(
  taskId: string,
  sessionToken: string,
  input: UpdateTaskInput,
): Promise<{ taskId: string }> {
  const response = await fetch(`${API_BASE}/tasks/${encodeURIComponent(taskId)}/update`, {
    method: 'POST',
    headers: authHeaders(sessionToken),
    body: JSON.stringify(input),
  });

  return parseResponse<{ taskId: string }>(response);
}

export async function uploadTaskAttachment(
  taskId: string,
  sessionToken: string,
  file: File,
  caption: string,
): Promise<{ attachment: TripTaskAttachment }> {
  const formData = new FormData();
  formData.append('file', file);
  if (caption.trim()) {
    formData.append('caption', caption.trim());
  }

  const response = await fetch(`${API_BASE}/tasks/${encodeURIComponent(taskId)}/upload`, {
    method: 'POST',
    headers: {
      'x-field-ops-session': sessionToken,
    },
    body: formData,
  });

  return parseResponse<{ attachment: TripTaskAttachment }>(response);
}

export async function getGallery(slug: string, sessionToken: string): Promise<FieldOpsGalleryResponse> {
  const response = await fetch(`${API_BASE}/gallery?slug=${encodeURIComponent(slug)}`, {
    headers: {
      'x-field-ops-session': sessionToken,
    },
  });

  return parseResponse<FieldOpsGalleryResponse>(response);
}

export async function deleteAttachment(
  attachmentId: string,
  sessionToken: string,
): Promise<{ attachmentId: string }> {
  const response = await fetch(`${API_BASE}/attachments/${encodeURIComponent(attachmentId)}`, {
    method: 'DELETE',
    headers: {
      'x-field-ops-session': sessionToken,
    },
  });

  return parseResponse<{ attachmentId: string }>(response);
}
