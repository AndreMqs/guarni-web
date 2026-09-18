import type { ReactNode } from 'react';

export type DialogProps = {
  title: string;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
  opened?: boolean;
  onClose?: () => void;
};
