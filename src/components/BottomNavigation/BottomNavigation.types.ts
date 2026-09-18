import type { Navigate, NavigationMode } from '../../navigation';

export type NavigationItemKey = 'today' | 'history' | 'more';

export type BottomNavigationProps = {
  active: NavigationItemKey;
  navigate: Navigate;
  mode?: NavigationMode;
};
