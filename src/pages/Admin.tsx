import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Camera,
  MapPin,
  Wrench,
  Download,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import { useAdminChecklist } from '../hooks/useAdminChecklist';
import { getAllPhotoProofs, type PhotoProofRecord } from '../lib/photoProofStore';
import { parks } from '../data/parks';
import type { Park } from '../types';
import { useCalibrationDrafts } from '../hooks/useCalibrationDrafts';

export default function Admin() {
  const challenges = useChallenges();
  const { getProgress } = useProgressContext();
  const { items, updateItem, resetChecklist } = useAdminChecklist();
  const { drafts, clearDraft } = useCalibrationDrafts();
  const [activePark, setActivePark] = useState<Park | 'all'>('all');
  const [photoProofs, setPhotoProofs] = useState<Record<string, PhotoProofRecord>>({});
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [calibrationCopyState, setCalibrationCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    getAllPhotoProofs()
      .then((records) => {
        setPhotoProofs(
          Object.fromEntries(records.map((record) => [record.challengeId, record])),
        );
      })
      .catch(() => {
        setPhotoProofs({});
      });
  }, []);

  const filteredChallenges = useMemo(
    () =>
      activePark === 'all'
        ? challenges
        : challenges.filter((challenge) => challenge.park === activePark),
    [activePark, challenges],
  );

  const completedCount = challenges.filter(
    (challenge) => getProgress(challenge.id).status === 'completed',
  ).length;
  const proofCount = Object.keys(photoProofs).length;
  const flaggedCount = Object.values(items).filter(
    (item) => item.needsUpdatedPhoto || item.needsLocationRetest || item.needsOpsReview || item.note.trim(),
  ).length;
  const draftCount = Object.keys(drafts).length;

  const checklistMarkdown = buildChecklistMarkdown(filteredChallenges, items, getProgress, photoProofs);
  const calibrationDraftMarkdown = buildCalibrationDraftMarkdown(filteredChallenges, drafts);

  const copyChecklist = async () => {
    try {
      await navigator.clipboard.writeText(checklistMarkdown);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const downloadChecklist = () => {
    const blob = new Blob([checklistMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'universal-hunt-field-checklist.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyCalibrationDrafts = async () => {
    try {
      await navigator.clipboard.writeText(calibrationDraftMarkdown);
      setCalibrationCopyState('copied');
    } catch {
      setCalibrationCopyState('error');
    }
  };

  const downloadCalibrationDrafts = () => {
    const blob = new Blob([calibrationDraftMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'universal-hunt-calibration-drafts.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList size={22} className="text-slate-700" />
            Field Testing Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track live proof photos, park notes, and post-trip fixes.
          </p>
        </div>
        <Link
          to="/profile"
          className="text-xs font-semibold text-slate-500 underline underline-offset-2"
        >
          Back to profile
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <SummaryCard label="Completed" value={completedCount} Icon={CheckCircle2} color="#16A34A" />
        <SummaryCard label="Proof Photos" value={proofCount} Icon={Camera} color="#2563EB" />
        <SummaryCard label="Flagged" value={flaggedCount} Icon={Wrench} color="#EA580C" />
        <SummaryCard label="Draft Pins" value={draftCount} Icon={MapPin} color="#0284C7" />
      </div>

      <div className="mt-4 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800">Trip checklist export</p>
        <p className="text-xs text-slate-500 mt-1">
          Copy or download your testing checklist before you head into the parks.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={copyChecklist}
            className="px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold flex items-center gap-2"
          >
            <Copy size={14} />
            {copyState === 'copied' ? 'Copied' : 'Copy Checklist'}
          </button>
          <button
            onClick={downloadChecklist}
            className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2"
          >
            <Download size={14} />
            Download Markdown
          </button>
          <button
            onClick={resetChecklist}
            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold"
          >
            Reset Notes
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800">Calibration draft export</p>
        <p className="text-xs text-slate-500 mt-1">
          Copy grouped coordinate and radius snippets for the static challenge JSON files.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={copyCalibrationDrafts}
            className="px-3 py-2 rounded-lg bg-sky-700 text-white text-sm font-semibold flex items-center gap-2"
          >
            <Copy size={14} />
            {calibrationCopyState === 'copied' ? 'Copied' : 'Copy Draft Export'}
          </button>
          <button
            onClick={downloadCalibrationDrafts}
            className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2"
          >
            <Download size={14} />
            Download Draft Export
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        <FilterButton label="All Parks" active={activePark === 'all'} onClick={() => setActivePark('all')} />
        {parks.map((park) => (
          <FilterButton
            key={park.id}
            label={park.name}
            active={activePark === park.id}
            onClick={() => setActivePark(park.id)}
          />
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filteredChallenges.map((challenge) => {
          const note = items[challenge.id];
          const progress = getProgress(challenge.id);
          const proof = photoProofs[challenge.id];

          return (
            <div key={challenge.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{challenge.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {challenge.estimatedTime} · {challenge.park} · {challenge.land}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                    progress.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {progress.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <ToggleChip
                  active={note?.needsUpdatedPhoto ?? false}
                  Icon={Camera}
                  label="Needs updated photo"
                  onClick={() =>
                    updateItem(challenge.id, { needsUpdatedPhoto: !(note?.needsUpdatedPhoto ?? false) })
                  }
                />
                <ToggleChip
                  active={note?.needsLocationRetest ?? false}
                  Icon={MapPin}
                  label="Retest location"
                  onClick={() =>
                    updateItem(challenge.id, { needsLocationRetest: !(note?.needsLocationRetest ?? false) })
                  }
                />
                <ToggleChip
                  active={note?.needsOpsReview ?? false}
                  Icon={Wrench}
                  label="Ops review"
                  onClick={() =>
                    updateItem(challenge.id, { needsOpsReview: !(note?.needsOpsReview ?? false) })
                  }
                />
              </div>

              <textarea
                value={note?.note ?? ''}
                onChange={(event) => updateItem(challenge.id, { note: event.target.value })}
                placeholder="Trip notes, signage changes, clue updates, queue changes..."
                className="mt-3 w-full min-h-[84px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
              />

              <div className="mt-3 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Stored proof photo
                  </p>
                  {proof ? (
                    <img
                      src={proof.dataUrl}
                      alt={`${challenge.title} proof`}
                      className="mt-2 w-full max-w-[180px] rounded-xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">No local proof photo captured yet.</p>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  {proof ? `Captured ${new Date(proof.capturedAt).toLocaleString()}` : 'Capture from challenge page'}
                </div>
              </div>

              {drafts[challenge.id] && (
                <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                        Saved coordinate draft
                      </p>
                      <p className="text-sm text-sky-900 mt-1">
                        {drafts[challenge.id].lat.toFixed(6)}, {drafts[challenge.id].lng.toFixed(6)}
                      </p>
                      <p className="text-xs text-sky-700 mt-1">
                        Radius {drafts[challenge.id].searchRadius}m ·
                        {' '}
                        Captured at zoom {drafts[challenge.id].zoom.toFixed(2)} on{' '}
                        {new Date(drafts[challenge.id].capturedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            `"coordinates": { "lat": ${drafts[challenge.id].lat.toFixed(6)}, "lng": ${drafts[challenge.id].lng.toFixed(6)} },\n"searchRadius": ${drafts[challenge.id].searchRadius}`,
                          );
                        }}
                        className="px-3 py-2 rounded-lg bg-white text-sky-700 text-xs font-semibold border border-sky-200"
                      >
                        Copy JSON
                      </button>
                      <button
                        onClick={() => clearDraft(challenge.id)}
                        className="px-3 py-2 rounded-lg bg-white text-slate-500 text-xs font-semibold border border-slate-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildChecklistMarkdown(
  challenges: ReturnType<typeof useChallenges>,
  items: ReturnType<typeof useAdminChecklist>['items'],
  getProgress: ReturnType<typeof useProgressContext>['getProgress'],
  photoProofs: Record<string, PhotoProofRecord>,
) {
  const lines = [
    '# Universal Hunt Field Checklist',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
  ];

  for (const challenge of challenges) {
    const note = items[challenge.id];
    const progress = getProgress(challenge.id);
    const proof = photoProofs[challenge.id];
    const flags = [
      note?.needsUpdatedPhoto ? 'updated-photo' : null,
      note?.needsLocationRetest ? 'location-retest' : null,
      note?.needsOpsReview ? 'ops-review' : null,
    ].filter(Boolean);

    lines.push(`## ${challenge.title}`);
    lines.push(`- Status: ${progress.status}`);
    lines.push(`- Proof photo: ${proof ? 'captured' : 'missing'}`);
    lines.push(`- Flags: ${flags.length > 0 ? flags.join(', ') : 'none'}`);
    lines.push(`- Note: ${note?.note?.trim() || 'none'}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildCalibrationDraftMarkdown(
  challenges: ReturnType<typeof useChallenges>,
  drafts: ReturnType<typeof useCalibrationDrafts>['drafts'],
) {
  const grouped = new Map<string, typeof challenges>();

  for (const challenge of challenges) {
    if (!drafts[challenge.id]) continue;
    const key = challengeSourcePath(challenge.park);
    grouped.set(key, [...(grouped.get(key) ?? []), challenge]);
  }

  const lines = [
    '# Universal Hunt Calibration Draft Export',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
  ];

  if (grouped.size === 0) {
    lines.push('No saved calibration drafts for the current filter.');
    return lines.join('\n');
  }

  for (const [path, pathChallenges] of grouped.entries()) {
    lines.push(`## ${path}`);
    lines.push('');

    for (const challenge of pathChallenges) {
      const draft = drafts[challenge.id];
      if (!draft) continue;

      lines.push(`### ${challenge.title} (\`${challenge.id}\`)`);
      lines.push(`- Current: ${challenge.coordinates.lat.toFixed(6)}, ${challenge.coordinates.lng.toFixed(6)} · radius ${challenge.searchRadius}m`);
      lines.push(`- Draft: ${draft.lat.toFixed(6)}, ${draft.lng.toFixed(6)} · radius ${draft.searchRadius}m`);
      lines.push(`- Captured: ${new Date(draft.capturedAt).toLocaleString()} at zoom ${draft.zoom.toFixed(2)}`);
      lines.push('```json');
      lines.push(`"coordinates": { "lat": ${draft.lat.toFixed(6)}, "lng": ${draft.lng.toFixed(6)} },`);
      lines.push(`"searchRadius": ${draft.searchRadius}`);
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

function challengeSourcePath(park: Park) {
  if (park === 'universal-studios') return 'src/content/challenges/universal-studios.json';
  if (park === 'islands-of-adventure') return 'src/content/challenges/islands-of-adventure.json';
  if (park === 'citywalk') return 'src/content/challenges/citywalk.json';
  return 'src/content/challenges/unknown.json';
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        active ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function SummaryCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: number;
  Icon: typeof CheckCircle2;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1" style={{ backgroundColor: `${color}15` }}>
        <Icon size={16} color={color} />
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ToggleChip({
  active,
  label,
  Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  Icon: typeof Camera;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
        active ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
