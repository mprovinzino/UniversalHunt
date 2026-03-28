import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  Lock,
  Route,
  Upload,
  Users,
} from 'lucide-react';
import {
  createSession,
  deleteAttachment,
  getBoard,
  getGallery,
  getTasks,
  updateTask,
  uploadTaskAttachment,
} from '../lib/fieldOpsApi';
import type {
  FieldOpsTaskStatus,
  TripParticipant,
  TripTask,
  TripTaskAttachment,
} from '../types/fieldOps';

const ACTIVE_BOARD_SLUG = 'apr-2026-field-test';
const PARTICIPANT_STORAGE_KEY = 'fieldOpsParticipantName';
const SESSION_STORAGE_KEY = 'fieldOpsSessionToken';

const ROUTE_LABELS: Record<string, string> = {
  citywalk: 'CityWalk',
  'diagon-alley': 'Secrets of Diagon Alley',
  'minion-mischief': 'Minion Mischief',
  'springfield-side-quest': 'Springfield Side Quest',
};

const TASK_TYPE_LABELS: Record<TripTask['taskType'], string> = {
  photo: 'Photo',
  coordinate: 'Coordinate',
  'clue-test': 'Clue Test',
  note: 'Note',
};

export default function FieldOps() {
  const [isBooting, setIsBooting] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tripTitle, setTripTitle] = useState('');
  const [participants, setParticipants] = useState<TripParticipant[]>([]);

  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [tripCode, setTripCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');

  const [tasks, setTasks] = useState<TripTask[]>([]);
  const [gallery, setGallery] = useState<TripTaskAttachment[]>([]);

  const [activeRoute, setActiveRoute] = useState<string>('all');
  const [galleryRoute, setGalleryRoute] = useState<string>('all');
  const [galleryParticipant, setGalleryParticipant] = useState<string>('all');
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [uploadCaptions, setUploadCaptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const boot = async () => {
      setError(null);

      try {
        const [{ board, participants: nextParticipants }] = await Promise.all([
          getBoard(ACTIVE_BOARD_SLUG),
        ]);

        setTripTitle(board.title);
        setParticipants(nextParticipants);

        const storedParticipant = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
        const storedToken = localStorage.getItem(SESSION_STORAGE_KEY);

        if (storedParticipant) {
          setSelectedParticipant(storedParticipant);
        }

        if (storedToken) {
          setSessionToken(storedToken);
          setIsSessionReady(true);
        }
      } catch (caughtError) {
        setError(toMessage(caughtError));
      } finally {
        setIsBooting(false);
      }
    };

    void boot();
  }, []);

  useEffect(() => {
    if (!isSessionReady || !sessionToken) {
      return;
    }

    void refreshData(sessionToken);
  }, [isSessionReady, sessionToken]);

  const routeKeys = useMemo(() => {
    const known = new Set<string>();

    tasks.forEach((task) => known.add(task.routeKey));
    gallery.forEach((attachment) => known.add(attachment.routeKey));

    return [...known].sort((a, b) => routeLabel(a).localeCompare(routeLabel(b)));
  }, [tasks, gallery]);

  const summary = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const open = tasks.length - done - inProgress;

    return { done, inProgress, open };
  }, [tasks]);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => activeRoute === 'all' || task.routeKey === activeRoute),
    [activeRoute, tasks],
  );

  const groupedTasks = useMemo(() => {
    return visibleTasks.reduce<Record<string, TripTask[]>>((acc, task) => {
      if (!acc[task.routeKey]) {
        acc[task.routeKey] = [];
      }

      acc[task.routeKey].push(task);
      return acc;
    }, {});
  }, [visibleTasks]);

  const filteredGallery = useMemo(
    () =>
      gallery.filter(
        (asset) =>
          (galleryRoute === 'all' || asset.routeKey === galleryRoute) &&
          (galleryParticipant === 'all' || asset.uploadedByName === galleryParticipant),
      ),
    [gallery, galleryParticipant, galleryRoute],
  );

  const refreshData = async (token: string) => {
    setIsLoadingData(true);
    setError(null);

    try {
      const [tasksPayload, galleryPayload] = await Promise.all([
        getTasks(ACTIVE_BOARD_SLUG, token),
        getGallery(ACTIVE_BOARD_SLUG, token),
      ]);

      setTasks(tasksPayload.tasks);
      setGallery(galleryPayload.attachments);
    } catch (caughtError) {
      setError(toMessage(caughtError));
      setIsSessionReady(false);
      setSessionToken('');
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUnlockBoard = async () => {
    if (!selectedParticipant) {
      setError('Choose your name first.');
      return;
    }

    if (!tripCode.trim()) {
      setError('Enter the trip code to continue.');
      return;
    }

    try {
      setError(null);
      const session = await createSession(ACTIVE_BOARD_SLUG, selectedParticipant, tripCode.trim());
      setSessionToken(session.sessionToken);
      setIsSessionReady(true);
      localStorage.setItem(PARTICIPANT_STORAGE_KEY, session.participantName);
      localStorage.setItem(SESSION_STORAGE_KEY, session.sessionToken);
      setTripCode('');
    } catch (caughtError) {
      setError(toMessage(caughtError));
    }
  };

  const handleTaskUpdate = async (
    taskId: string,
    input: { status?: FieldOpsTaskStatus; notes?: string; assignedToName?: string | null },
  ) => {
    if (!sessionToken) {
      return;
    }

    try {
      setError(null);
      await updateTask(taskId, sessionToken, input);
      await refreshData(sessionToken);
    } catch (caughtError) {
      setError(toMessage(caughtError));
    }
  };

  const handleUpload = async (taskId: string, file: File | null) => {
    if (!file || !sessionToken) {
      return;
    }

    try {
      setUploadingTaskId(taskId);
      await uploadTaskAttachment(taskId, sessionToken, file, uploadCaptions[taskId] ?? '');
      setUploadCaptions((previous) => ({ ...previous, [taskId]: '' }));
      await refreshData(sessionToken);
    } catch (caughtError) {
      setError(toMessage(caughtError));
    } finally {
      setUploadingTaskId(null);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!sessionToken) {
      return;
    }

    try {
      await deleteAttachment(attachmentId, sessionToken);
      await refreshData(sessionToken);
    } catch (caughtError) {
      setError(toMessage(caughtError));
    }
  };

  if (isBooting) {
    return (
      <div className="flex-1 px-4 pt-10 pb-24 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading field ops board…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList size={22} className="text-slate-700" />
            Field Ops
          </h1>
          <p className="text-sm text-slate-500 mt-1">{tripTitle || 'Shared trip checklist and photo collection board'}</p>
        </div>
        <Link to="/profile" className="text-xs font-semibold text-slate-500 underline underline-offset-2">
          Back to profile
        </Link>
      </header>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!isSessionReady ? (
        <section className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Lock size={16} />
            Trip access gate
          </h2>
          <p className="text-xs text-slate-500">Select your approved participant name and enter the shared trip code.</p>

          <label className="block text-xs font-semibold text-slate-600">
            Participant name
            <select
              value={selectedParticipant}
              onChange={(event) => setSelectedParticipant(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Select name…</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.displayName}>
                  {participant.displayName}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-600">
            Trip code
            <input
              type="password"
              value={tripCode}
              onChange={(event) => setTripCode(event.target.value)}
              placeholder="Enter shared code"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </label>

          <button
            onClick={() => void handleUnlockBoard()}
            className="w-full rounded-lg bg-slate-800 text-white py-2 text-sm font-semibold"
          >
            Unlock Field Ops
          </button>
        </section>
      ) : (
        <>
          <section className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Board overview</p>
                <p className="text-base font-semibold text-slate-800 mt-1">{tripTitle}</p>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Users size={14} />
                {selectedParticipant}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              <SummaryTile label="Tasks" value={tasks.length} />
              <SummaryTile label="Open" value={summary.open} />
              <SummaryTile label="In Progress" value={summary.inProgress} />
              <SummaryTile label="Done" value={summary.done} />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
              <FilterChip active={activeRoute === 'all'} onClick={() => setActiveRoute('all')} label="All Routes" />
              {routeKeys.map((routeKey) => (
                <FilterChip
                  key={routeKey}
                  active={activeRoute === routeKey}
                  onClick={() => setActiveRoute(routeKey)}
                  label={routeLabel(routeKey)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            {isLoadingData ? (
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-sm text-slate-500 flex items-center gap-2">
                <LoaderCircle className="animate-spin" size={16} /> Syncing tasks…
              </div>
            ) : (
              Object.entries(groupedTasks)
                .sort(([a], [b]) => routeLabel(a).localeCompare(routeLabel(b)))
                .map(([routeKey, routeTasks]) => (
                  <div key={routeKey} className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Route size={16} /> {routeLabel(routeKey)}
                    </h2>
                    {routeTasks.map((task) => (
                      <article key={task.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{TASK_TYPE_LABELS[task.taskType]} · {task.priority.toUpperCase()}</p>
                          </div>
                          <TaskStatusBadge status={task.status} />
                        </div>

                        <p className="text-sm text-slate-600">{task.instructions}</p>

                        <div className="flex gap-2 flex-wrap">
                          <StatusButton label="Open" active={task.status === 'open'} onClick={() => void handleTaskUpdate(task.id, { status: 'open' })} />
                          <StatusButton label="In Progress" active={task.status === 'in-progress'} onClick={() => void handleTaskUpdate(task.id, { status: 'in-progress' })} />
                          <StatusButton label="Done" active={task.status === 'done'} onClick={() => void handleTaskUpdate(task.id, { status: 'done' })} />
                        </div>

                        <label className="block text-xs font-semibold text-slate-600">
                          Assign participant
                          <select
                            value={task.assignedToName ?? ''}
                            onChange={(event) =>
                              void handleTaskUpdate(task.id, {
                                assignedToName: event.target.value || null,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                          >
                            <option value="">Unassigned</option>
                            {participants.map((participant) => (
                              <option key={participant.id} value={participant.displayName}>
                                {participant.displayName}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block text-xs font-semibold text-slate-600">
                          Notes
                          <textarea
                            defaultValue={task.notes}
                            placeholder="Add what worked, what broke, and what needs updates"
                            className="mt-1 w-full min-h-[80px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                            onBlur={(event) =>
                              void handleTaskUpdate(task.id, {
                                notes: event.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="rounded-lg border border-slate-200 p-3 space-y-2">
                          <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <Upload size={14} /> Task photo upload
                          </p>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            capture="environment"
                            onChange={(event) => void handleUpload(task.id, event.target.files?.[0] ?? null)}
                            className="block w-full text-xs text-slate-500"
                          />
                          <input
                            type="text"
                            value={uploadCaptions[task.id] ?? ''}
                            onChange={(event) =>
                              setUploadCaptions((previous) => ({
                                ...previous,
                                [task.id]: event.target.value,
                              }))
                            }
                            placeholder="Optional caption"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                          />
                          {uploadingTaskId === task.id && (
                            <p className="text-xs text-slate-500">Uploading…</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ))
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Camera size={16} /> Shared gallery
              </h2>
              <p className="text-xs text-slate-500">{filteredGallery.length} assets</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={galleryRoute}
                onChange={(event) => setGalleryRoute(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700"
              >
                <option value="all">All routes</option>
                {routeKeys.map((routeKey) => (
                  <option key={routeKey} value={routeKey}>
                    {routeLabel(routeKey)}
                  </option>
                ))}
              </select>

              <select
                value={galleryParticipant}
                onChange={(event) => setGalleryParticipant(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700"
              >
                <option value="all">All participants</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.displayName}>
                    {participant.displayName}
                  </option>
                ))}
              </select>
            </div>

            {filteredGallery.length === 0 ? (
              <p className="text-sm text-slate-500">No uploads yet for this filter.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredGallery.map((attachment) => (
                  <article key={attachment.id} className="rounded-lg border border-slate-200 p-2 space-y-2">
                    <img
                      src={attachment.downloadUrl}
                      alt={attachment.caption ?? attachment.filename}
                      className="w-full h-32 object-cover rounded-md"
                      loading="lazy"
                    />
                    <p className="text-[11px] text-slate-500">
                      {routeLabel(attachment.routeKey)} · {attachment.uploadedByName}
                    </p>
                    {attachment.caption && <p className="text-xs text-slate-700">{attachment.caption}</p>}
                    <button
                      onClick={() => void handleDeleteAttachment(attachment.id)}
                      className="text-xs text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
        active
          ? 'bg-slate-800 text-white border-slate-800'
          : 'bg-white text-slate-600 border-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function TaskStatusBadge({ status }: { status: FieldOpsTaskStatus }) {
  if (status === 'done') {
    return (
      <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
        <CheckCircle2 size={12} /> Done
      </span>
    );
  }

  if (status === 'in-progress') {
    return <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">In progress</span>;
  }

  return <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">Open</span>;
}

function StatusButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
        active
          ? 'bg-slate-800 text-white border-slate-800'
          : 'bg-white text-slate-600 border-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function routeLabel(routeKey: string) {
  return ROUTE_LABELS[routeKey] ?? routeKey;
}

function toMessage(caughtError: unknown) {
  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return 'Something went wrong. Please try again.';
}
