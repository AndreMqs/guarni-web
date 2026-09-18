import { QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import * as authApi from './api/auth'
import App from './App'
import { routes } from './navigation'
import { queryClient } from './queryClient'
import type { AppRouterProps } from './router/AppRouter'
import { render } from './test/render'

vi.mock('./router/AppRouter', () => ({ AppRouter: ({ initialRoute, onLogout }: AppRouterProps) => <div><p>{initialRoute}</p><button onClick={onLogout}>Sair</button></div> }))

beforeEach(() => queryClient.clear())
afterEach(() => queryClient.clear())

async function submitLogin(username: string) {
  const user = userEvent.setup()
  render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>)
  await user.type(screen.getByLabelText(/Usuário/), username)
  await user.type(screen.getByLabelText(/Senha/), 'senha-segura-123')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
  return user
}

it.each([
  ['FUNCIONARIO', routes.tasks.today],
  ['GERENTE', routes.management.dashboard],
  ['dono', routes.management.dashboard],
])('opens the initial route for %s after authentication', async (username, route) => {
  await submitLogin(username)
  expect(await screen.findByText(route)).toBeVisible()
  expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
})

it('shows a login failure and lets the user retry', async () => {
  vi.spyOn(authApi, 'login').mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ accessToken: 'token', role: 'owner' })
  const user = await submitLogin('dono')
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível entrar. Tente novamente.')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
  expect(await screen.findByText(routes.management.dashboard)).toBeVisible()
})

it('clears cached private data and returns to login on logout', async () => {
  const user = await submitLogin('gerente')
  await screen.findByText(routes.management.dashboard)
  queryClient.setQueryData(['private-data'], { secret: 'cached' })
  await user.click(screen.getByRole('button', { name: 'Sair' }))
  expect(await screen.findByRole('button', { name: 'Entrar' })).toBeEnabled()
  await waitFor(() => expect(queryClient.getQueryData(['private-data'])).toBeUndefined())
})
