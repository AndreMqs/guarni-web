import { useLoginMutation } from './hooks/index.ts'
import { LoginView } from './views/Login/index.ts'

function App() {
  const loginMutation = useLoginMutation()

  return (
    <LoginView
      onSubmit={async (credentials) => {
        await loginMutation.mutateAsync(credentials)
      }}
      isSubmitting={loginMutation.isPending}
      submitError={
        loginMutation.isError
          ? 'Não foi possível entrar. Tente novamente.'
          : undefined
      }
    />
  )
}

export default App
