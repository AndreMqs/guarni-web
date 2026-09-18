import type { ReactNode } from 'react';

export type BottomSheetProps = {
  children: ReactNode;
  opened?: boolean;
  onClose?: () => void;
};
