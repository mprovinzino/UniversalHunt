export type FieldOpsTaskType = 'photo' | 'coordinate' | 'clue-test' | 'note';
export type FieldOpsTaskPriority = 'must' | 'should' | 'bonus';
export type FieldOpsTaskStatus = 'open' | 'in-progress' | 'done';

export interface TripParticipant {
  id: string;
  displayName: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TripBoard {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  routes: string[];
}

export interface TripSession {
  board: TripBoard;
  participantName: string;
  sessionToken: string;
}

export interface TripTask {
  id: string;
  tripBoardId: string;
  routeKey: string;
  title: string;
  taskType: FieldOpsTaskType;
  priority: FieldOpsTaskPriority;
  status: FieldOpsTaskStatus;
  instructions: string;
  assignedToName: string | null;
  notes: string;
  updatedByName: string | null;
  updatedAt: string;
}

export interface TripTaskAttachment {
  id: string;
  tripTaskId: string;
  tripBoardId: string;
  routeKey: string;
  taskType: FieldOpsTaskType;
  blobKey: string;
  filename: string;
  mimeType: string;
  uploadedByName: string;
  caption: string | null;
  createdAt: string;
  downloadUrl: string;
}

export type FieldOpsActivityAction = 'task-update' | 'attachment-upload' | 'attachment-delete';

export interface FieldOpsBoardResponse {
  board: TripBoard;
  participants: TripParticipant[];
}

export interface FieldOpsTasksResponse {
  tasks: TripTask[];
}

export interface FieldOpsGalleryResponse {
  attachments: TripTaskAttachment[];
}


export interface TripTaskUpdate {
  id: string;
  tripBoardId: string;
  taskId: string;
  action: FieldOpsActivityAction;
  byName: string;
  createdAt: string;
  routeKey: string | null;
  taskTitle: string | null;
  attachmentId: string | null;
  caption: string | null;
}

export interface FieldOpsActivityResponse {
  updates: TripTaskUpdate[];
}

export interface FieldOpsApiError {
  error: string;
}
