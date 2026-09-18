import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expect, test } from 'vitest'
import { render } from '../../test/render.ts'
import { PasswordField } from './PasswordField.tsx'

test('associates the label and native attributes with the password input', () => {
  render(<PasswordField label="Senha" name="password" autoComplete="current-password" />)

  const input = screen.getByLabelText('Senha')
  expect(input).toHaveAttribute('type', 'password')
  expect(input).toHaveAttribute('name', 'password')
  expect(input).toHaveAttribute('autocomplete', 'current-password')
})

test('allows the password visibility to be toggled', async () => {
  const user = userEvent.setup()
  render(<PasswordField label="Senha" />)

  const input = screen.getByLabelText('Senha')
  await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
  expect(input).toHaveAttribute('type', 'text')

  await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
  expect(input).toHaveAttribute('type', 'password')
})

test('exposes required and invalid states accessibly', () => {
  render(<PasswordField label="Senha" isRequired errorMessage="Informe a senha." />)

  const input = screen.getByLabelText(/Senha/)
  const error = screen.getByText('Informe a senha.')
  expect(input).toBeRequired()
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAttribute('aria-describedby', error.id)
})

test('forwards the input ref and consumer class', () => {
  const ref = createRef<HTMLInputElement>()
  render(<PasswordField ref={ref} label="Senha" className="consumer-class" />)

  const input = screen.getByLabelText('Senha')
  expect(ref.current).toBe(input)
  expect(input).toHaveClass('consumer-class')
})
