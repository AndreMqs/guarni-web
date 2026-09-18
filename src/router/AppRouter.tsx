import { useEffect } from 'react';
import { AuditView } from '../views/Audit';
import { EmployeeView } from '../views/Employee';
import { ManagementView } from '../views/Management';
import { employeeRoutes, managementRoutes, useNavigationStore, type AppRoute } from '../navigation';

export type AppRouterProps = {
  initialRoute: AppRoute;
  onLogout: () => void;
};

export function AppRouter({ initialRoute, onLogout }: AppRouterProps) {
  const route = useNavigationStore((state) => state.route);
  const navigate = useNavigationStore((state) => state.navigate);
  const reset = useNavigationStore((state) => state.reset);

  useEffect(() => {
    reset(initialRoute);
    const handlePopState = () => reset(initialRoute);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialRoute, reset]);

  if (employeeRoutes.has(route)) {
    return <EmployeeView route={route} navigate={navigate} />;
  }

  if (managementRoutes.has(route)) {
    return <ManagementView route={route} navigate={navigate} onLogout={onLogout} />;
  }

  return <AuditView route={route} navigate={navigate} onLogout={onLogout} />;
}
