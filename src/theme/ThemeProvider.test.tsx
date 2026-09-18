import { screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { render } from '../test/render.ts'
import { activeTheme } from './restaurantThemes.ts'

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-mantine-color-scheme')
})

test('renders children with the active Guarni theme tokens', () => {
  render(<h1>Guarni</h1>)

  expect(screen.getByRole('heading', { name: 'Guarni' })).toBeInTheDocument()
  const styles = window.getComputedStyle(document.documentElement)
  expect(styles.getPropertyValue('--guarni-background').trim()).toBe(activeTheme.colors.background)
  expect(styles.getPropertyValue('--guarni-primary').trim()).toBe(
    activeTheme.primary.palette[activeTheme.primary.shade],
  )
})

test('uses the code configuration instead of a saved color scheme', () => {
  const savedScheme = activeTheme.colorScheme === 'light' ? 'dark' : 'light'
  window.localStorage.setItem('mantine-color-scheme-value', savedScheme)

  render(<h1>Guarni</h1>)

  expect(document.documentElement).toHaveAttribute('data-mantine-color-scheme', activeTheme.colorScheme)
})
