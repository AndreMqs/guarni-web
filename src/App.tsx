import { useState } from 'react';
import { loginPageText } from './constants/login.ts';
import { useLoginMutation } from './hooks/index.ts';
import { routes, type AppRoute } from './navigation';
import { queryClient } from './queryClient.ts';
import { AppRouter } from './router/AppRouter.tsx';
import { LoginView } from './views/Login/index.ts';
import type { NavigationMode } from './navigation/types';

function App() {
  const [accessToken, setAccessToken] = useState<string>();
  const [initialRoute, setInitialRoute] = useState<AppRoute>(routes.management.dashboard);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('owner');
  const loginMutation = useLoginMutation();

  if (accessToken) {
    return <AppRouter initialRoute={initialRoute} navigationMode={navigationMode} onLogout={() => { queryClient.clear(); window.history.replaceState(null, '', window.location.pathname + window.location.search); setAccessToken(undefined); }} />;
  }

  return (
    <LoginView
      onSubmit={(credentials) => {
        loginMutation.mutate(credentials, {
          onSuccess: (response) => {
            queryClient.clear();
            setInitialRoute(response.role === 'employee' ? routes.tasks.today : routes.management.dashboard);
            setNavigationMode(response.role);
            setAccessToken(response.accessToken);
          },
        });
      }}
      isSubmitting={loginMutation.isPending}
      submitError={loginMutation.isError ? loginPageText.genericSubmitError : undefined}
    />
  );
}

export default App;
