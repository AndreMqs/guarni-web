import { render as testingLibraryRender } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from '../theme/ThemeProvider.tsx'

export function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: ThemeProvider })
}
