import { createContext } from 'react';
import { useProgress } from '../hooks/useProgress';

export type ProgressContextValue = ReturnType<typeof useProgress>;

export const ProgressContext = createContext<ProgressContextValue | null>(null);
