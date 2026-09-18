import type { ReactNode } from 'react';
import type { AppRoute, Navigate, NavigationMode } from '../../navigation';

export type FrameProps = {
  children: ReactNode;
  title?: string;
  action?: string;
  onAction?: () => void;
  backTo?: AppRoute;
  navigate: Navigate;
  bottomNav?: 'today' | 'history' | 'more';
  navMode?: NavigationMode;
};
