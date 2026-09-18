import type { ReactNode } from 'react';
export type StatusTone = 'pending' | 'done' | 'danger' | 'warning' | 'neutral';
export type StatusBadgeProps = { children: ReactNode; tone?: StatusTone };
