import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expect, test, vi } from 'vitest'
import { render } from '../../test/render.ts'
import { Button } from './Button.tsx'

test('renders a native button with safe defaults', () => {
  render(<Button>Salvar</Button>)

  expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'button')
})

test('forwards native attributes and click events', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(
    <Button name="save-task" value="confirm" onClick={handleClick}>
      Salvar tarefa
    </Button>,
  )

  const button = screen.getByRole('button', { name: 'Salvar tarefa' })
  expect(button).toHaveAttribute('name', 'save-task')
  expect(button).toHaveAttribute('value', 'confirm')
  await user.click(button)
  expect(handleClick).toHaveBeenCalledOnce()
})

test('supports form submission explicitly', () => {
  render(<Button type="submit">Entrar</Button>)

  expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute('type', 'submit')
})

test('prevents interaction when disabled', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(
    <Button disabled onClick={handleClick}>
      Excluir
    </Button>,
  )

  const button = screen.getByRole('button', { name: 'Excluir' })
  expect(button).toBeDisabled()
  await user.click(button)
  expect(handleClick).not.toHaveBeenCalled()
})

test('announces loading and prevents repeated submission', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(
    <Button isLoading onClick={handleClick}>
      Salvar
    </Button>,
  )

  const button = screen.getByRole('button', { name: 'Salvar' })
  expect(button).toBeDisabled()
  expect(button).toHaveAttribute('aria-busy', 'true')
  await user.click(button)
  expect(handleClick).not.toHaveBeenCalled()
})

test('forwards the button ref', () => {
  const ref = createRef<HTMLButtonElement>()
  render(<Button ref={ref}>Continuar</Button>)

  expect(ref.current).toBe(screen.getByRole('button', { name: 'Continuar' }))
})

test('supports the secondary visual contract and full width option', () => {
  render(
    <Button variant="secondary" size="lg" isFullWidth className="consumer-class">
      Cancelar
    </Button>,
  )

  const button = screen.getByRole('button', { name: 'Cancelar' })
  expect(button).toHaveClass('consumer-class')
  expect(button).toHaveAttribute('data-size', 'lg')
  expect(button).toHaveAttribute('data-block', 'true')
})
