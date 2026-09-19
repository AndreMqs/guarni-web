import type { ReactNode } from 'react';

export type BottomSheetProps = {
  children: ReactNode;
  title?: string;
  opened?: boolean;
  onClose?: () => void;
};
