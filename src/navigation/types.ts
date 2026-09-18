import type { AppRoute } from './routes';

export type Navigate = (route: AppRoute) => void;
export type NavigationMode = 'employee' | 'management' | 'owner';
export type { AppRoute } from './routes';
