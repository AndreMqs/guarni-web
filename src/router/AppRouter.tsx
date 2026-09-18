import { useEffect } from 'react';
import { AuditView } from '../views/Audit';
import { EmployeeView } from '../views/Employee';
import { ManagementView } from '../views/Management';
import { employeeRoutes, managementRoutes, routes, useNavigationStore, type AppRoute } from '../navigation';
import type { NavigationMode } from '../navigation/types';

export type AppRouterProps = {
  initialRoute: AppRoute;
  onLogout: () => void;
  navigationMode?: NavigationMode;
};

export function AppRouter({ initialRoute, onLogout, navigationMode = 'management' }: AppRouterProps) {
  const requestedRoute = useNavigationStore((state) => state.route);
  const route = navigationMode === 'employee' && !employeeRoutes.has(requestedRoute) ? routes.tasks.today : requestedRoute;
  const navigate = useNavigationStore((state) => state.navigate);
  const reset = useNavigationStore((state) => state.reset);

  useEffect(() => {
    reset(initialRoute);
    const handlePopState = () => reset(initialRoute);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialRoute, reset]);

  if (employeeRoutes.has(route)) {
    return <EmployeeView route={route} navigate={navigate} navMode={navigationMode} onLogout={onLogout} />;
  }

  if (managementRoutes.has(route)) {
    return <ManagementView route={route} navigate={navigate} onLogout={onLogout} navMode={navigationMode} />;
  }

  return <AuditView route={route} navigate={navigate} onLogout={onLogout} />;
}
