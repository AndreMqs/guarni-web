import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'
import '@mantine/core/styles.css'
import { createMantineTheme } from './createMantineTheme.ts'
import { activeTheme } from './restaurantThemes.ts'

const mantineConfig = createMantineTheme(activeTheme)

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <MantineProvider {...mantineConfig}>{children}</MantineProvider>
}
