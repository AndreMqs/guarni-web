import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expect, test, vi } from 'vitest'
import { render } from '../../test/render.ts'
import { TextField } from './TextField.tsx'

test('associates the visible label with the input', () => {
  render(<TextField label="Usuário" name="username" autoComplete="username" />)

  const input = screen.getByRole('textbox', { name: 'Usuário' })
  expect(input).toHaveAttribute('name', 'username')
  expect(input).toHaveAttribute('autocomplete', 'username')
})

test('supports text entry and change events', async () => {
  const user = userEvent.setup()
  const handleChange = vi.fn()
  render(<TextField label="Nome da tarefa" onChange={handleChange} />)

  const input = screen.getByRole('textbox', { name: 'Nome da tarefa' })
  await user.type(input, 'Limpar cozinha')

  expect(input).toHaveValue('Limpar cozinha')
  expect(handleChange).toHaveBeenCalled()
})

test('connects helper text to the input description', () => {
  render(<TextField label="Usuário" helperText="Use letras minúsculas." />)

  const input = screen.getByRole('textbox', { name: 'Usuário' })
  const helperText = screen.getByText('Use letras minúsculas.')
  expect(input).toHaveAttribute('aria-describedby', helperText.id)
})

test('exposes required and invalid states accessibly', () => {
  render(
    <TextField
      label="Usuário"
      isRequired
      errorMessage="Informe o usuário."
    />,
  )

  const input = screen.getByRole('textbox', { name: /Usuário/ })
  const error = screen.getByText('Informe o usuário.')
  expect(input).toBeRequired()
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAttribute('aria-describedby', error.id)
})

test('supports disabled and read-only native states', () => {
  const { rerender } = render(<TextField label="Unidade" disabled />)
  expect(screen.getByRole('textbox', { name: 'Unidade' })).toBeDisabled()

  rerender(<TextField label="Unidade" readOnly value="Tatuapé" />)
  expect(screen.getByRole('textbox', { name: 'Unidade' })).toHaveAttribute('readonly')
})

test('forwards the input ref and consumer class', () => {
  const ref = createRef<HTMLInputElement>()
  render(<TextField ref={ref} label="Descrição" className="consumer-class" />)

  const input = screen.getByRole('textbox', { name: 'Descrição' })
  expect(ref.current).toBe(input)
  expect(input).toHaveClass('consumer-class')
})
