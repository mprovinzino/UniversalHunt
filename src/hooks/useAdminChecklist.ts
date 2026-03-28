import { useCallback, useMemo, useState } from 'react';

export interface AdminChecklistItem {
  challengeId: string;
  needsUpdatedPhoto: boolean;
  needsLocationRetest: boolean;
  needsOpsReview: boolean;
  note: string;
  lastUpdatedAt?: string;
}

const STORAGE_KEY = 'universal-hunt-admin-checklist';

function loadChecklist(): Record<string, AdminChecklistItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AdminChecklistItem>;
  } catch {
    return {};
  }
}

export function useAdminChecklist() {
  const [items, setItems] = useState<Record<string, AdminChecklistItem>>(loadChecklist);

  const persist = useCallback((next: Record<string, AdminChecklistItem>) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateItem = useCallback(
    (challengeId: string, patch: Partial<AdminChecklistItem>) => {
      const existing = items[challengeId];
      const next = {
        ...items,
        [challengeId]: {
          ...(existing ?? {
            challengeId,
            needsUpdatedPhoto: false,
            needsLocationRetest: false,
            needsOpsReview: false,
            note: '',
          }),
          challengeId,
          ...patch,
          lastUpdatedAt: new Date().toISOString(),
        },
      };
      persist(next);
    },
    [items, persist],
  );

  const resetChecklist = useCallback(() => {
    persist({});
  }, [persist]);

  return useMemo(
    () => ({
      items,
      updateItem,
      resetChecklist,
    }),
    [items, resetChecklist, updateItem],
  );
}
