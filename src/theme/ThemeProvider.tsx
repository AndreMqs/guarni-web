import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'
import '@mantine/core/styles.css'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <MantineProvider forceColorScheme="light">{children}</MantineProvider>
}
