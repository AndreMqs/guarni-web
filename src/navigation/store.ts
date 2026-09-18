import { create } from 'zustand';
import { routes, validRoutes, type AppRoute } from './routes';

type NavigationState = {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  reset: (route: AppRoute) => void;
};

function readHash(): AppRoute | undefined {
  const candidate = window.location.hash.replace(/^#\/?/, '') as AppRoute;
  return validRoutes.has(candidate) ? candidate : undefined;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  route: readHash() ?? routes.owner.menu,
  navigate: (route) => {
    window.history.pushState(null, '', `#/${route}`);
    set({ route });
  },
  reset: (route) => set({ route: readHash() ?? route }),
}));
