import { useContext } from 'react';
import { ProgressContext } from '../context/progress-context';

export function useProgressContext() {
  const ctx = useContext(ProgressContext);

  if (!ctx) {
    throw new Error('useProgressContext must be used inside <ProgressProvider>');
  }

  return ctx;
}
