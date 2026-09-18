import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { render } from '../../test/render.ts'
import { LoginView } from './Login.tsx'

test('renders the approved login content and fields', () => {
  render(<LoginView onSubmit={vi.fn()} />)

  expect(screen.getByRole('heading', { name: 'Checklist Restaurante' })).toBeVisible()
  expect(screen.getByLabelText(/Usuário/)).toHaveAttribute('autocomplete', 'username')
  expect(screen.getByLabelText(/Senha/)).toHaveAttribute('autocomplete', 'current-password')
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
  expect(screen.queryByText(/esqueci/i)).not.toBeInTheDocument()
})

test('shows local validation errors before submitting', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()
  render(<LoginView onSubmit={handleSubmit} />)

  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(await screen.findByText('Informe o usuário.')).toBeVisible()
  expect(screen.getByText('Informe a senha.')).toBeVisible()
  expect(handleSubmit).not.toHaveBeenCalled()
})

test('normalizes and submits valid credentials', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()
  render(<LoginView onSubmit={handleSubmit} />)

  await user.type(screen.getByLabelText(/Usuário/), '  Andre.Silva  ')
  await user.type(screen.getByLabelText(/Senha/), 'senha-segura-123')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(handleSubmit).toHaveBeenCalledWith({
    username: 'andre.silva',
    password: 'senha-segura-123',
  })
})

test('renders the server error and locks the form while submitting', () => {
  render(
    <LoginView
      isSubmitting
      submitError="Nome de usuário ou senha inválidos."
      onSubmit={vi.fn()}
    />,
  )

  expect(screen.getByRole('alert')).toHaveTextContent('Nome de usuário ou senha inválidos.')
  expect(screen.getByLabelText(/Usuário/)).toBeDisabled()
  expect(screen.getByLabelText(/Senha/)).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled()
})
