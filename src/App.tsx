import { useState } from 'react'
import { loginPageText } from './constants/login.ts'
import { useLoginMutation, useTodayTasksQuery } from './hooks/index.ts'
import { LoginView } from './views/Login/index.ts'
import { TodayView } from './views/Today/index.ts'

function App() {
  const [accessToken, setAccessToken] = useState<string>()
  const loginMutation = useLoginMutation()
  const todayTasksQuery = useTodayTasksQuery(Boolean(accessToken))

  if (accessToken) {
    if (todayTasksQuery.data) {
      return <TodayView {...todayTasksQuery.data} />
    }

    return <div role="status">{loginPageText.loadingTasks}</div>
  }

  return (
    <LoginView
      onSubmit={async (credentials) => {
        const response = await loginMutation.mutateAsync(credentials)
        setAccessToken(response.accessToken)
      }}
      isSubmitting={loginMutation.isPending}
      submitError={
        loginMutation.isError
          ? loginPageText.genericSubmitError
          : undefined
      }
    />
  )
}

export default App
