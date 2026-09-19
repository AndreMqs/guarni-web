import type { ReactNode } from 'react';

export type FilterPanelProps<T> = {
  value: T;
  defaultValue: T;
  onApply: (value: T) => void;
  summary: string;
  activeCount?: number;
  initiallyOpen?: boolean;
  isValid?: (value: T) => boolean;
  children: (draft: T, setDraft: (value: T) => void) => ReactNode;
};
