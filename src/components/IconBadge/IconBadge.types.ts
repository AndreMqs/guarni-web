import type { ReactNode } from 'react';

export type IconBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export type IconBadgeProps = {
  children: ReactNode;
  tone?: IconBadgeTone;
  size?: 'md' | 'lg';
};
