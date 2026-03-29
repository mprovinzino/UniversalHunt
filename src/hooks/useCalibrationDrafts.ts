import { useCallback, useMemo, useState } from 'react';

export interface CalibrationDraft {
  challengeId: string;
  lat: number;
  lng: number;
  zoom: number;
  searchRadius: number;
  capturedAt: string;
}

const STORAGE_KEY = 'universal-hunt-calibration-drafts';

function loadDrafts(): Record<string, CalibrationDraft> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, CalibrationDraft>;
  } catch {
    return {};
  }
}

export function useCalibrationDrafts() {
  const [drafts, setDrafts] = useState<Record<string, CalibrationDraft>>(loadDrafts);

  const persist = useCallback((next: Record<string, CalibrationDraft>) => {
    setDrafts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const saveDraft = useCallback(
    (draft: CalibrationDraft) => {
      persist({
        ...drafts,
        [draft.challengeId]: draft,
      });
    },
    [drafts, persist],
  );

  const clearDraft = useCallback(
    (challengeId: string) => {
      const next = { ...drafts };
      delete next[challengeId];
      persist(next);
    },
    [drafts, persist],
  );

  return useMemo(
    () => ({
      drafts,
      saveDraft,
      clearDraft,
    }),
    [clearDraft, drafts, saveDraft],
  );
}
