import { useState } from 'react';
import { loginPageText } from './constants/login.ts';
import { useLoginMutation } from './hooks/index.ts';
import { routes, type AppRoute } from './navigation';
import { queryClient } from './queryClient.ts';
import { AppRouter } from './router/AppRouter.tsx';
import { LoginView } from './views/Login/index.ts';

function getInitialRoute(username: string): AppRoute {
  const normalizedUsername = username.toLowerCase();

  if (normalizedUsername.includes('func')) {
    return routes.tasks.today;
  }

  if (normalizedUsername.includes('ger')) {
    return routes.management.dashboard;
  }

  return routes.owner.menu;
}

function App() {
  const [accessToken, setAccessToken] = useState<string>();
  const [initialRoute, setInitialRoute] = useState<AppRoute>(routes.owner.menu);
  const loginMutation = useLoginMutation();

  if (accessToken) {
    return <AppRouter initialRoute={initialRoute} onLogout={() => { queryClient.clear(); setAccessToken(undefined); }} />;
  }

  return (
    <LoginView
      onSubmit={(credentials) => {
        loginMutation.mutate(credentials, {
          onSuccess: (response) => {
            setInitialRoute(getInitialRoute(credentials.username));
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
