import { useState } from 'react';
import { loginPageText } from './constants/login.ts';
import { useLoginMutation } from './hooks/index.ts';
import { routes, type AppRoute } from './navigation';
import { queryClient } from './queryClient.ts';
import { AppRouter } from './router/AppRouter.tsx';
import { LoginView } from './views/Login/index.ts';
import type { NavigationMode } from './navigation/types';

function getInitialRoute(username: string): AppRoute {
  const normalizedUsername = username.toLowerCase();

  if (normalizedUsername.includes('func')) {
    return routes.tasks.today;
  }

  if (normalizedUsername.includes('ger')) {
    return routes.management.dashboard;
  }

  return routes.management.dashboard;
}

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
            setInitialRoute(getInitialRoute(credentials.username));
            setNavigationMode(credentials.username.includes('func') ? 'employee' : credentials.username.includes('ger') ? 'management' : 'owner');
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
