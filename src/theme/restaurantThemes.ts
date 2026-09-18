import { defaultTheme } from './defaultTheme.ts'
import type { GuarniTheme } from './types.ts'

// Illustrative preset, not associated with a real restaurant or unit ID.
export const exampleDarkTheme: GuarniTheme = {
  ...defaultTheme,
  colorScheme: 'dark',
  primary: {
    palette: [
      '#e6fcf5', '#c3fae8', '#96f2d7', '#63e6be', '#38d9a9',
      '#20c997', '#12b886', '#0ca678', '#099268', '#087f5b',
    ],
    shade: 3,
  },
  colors: {
    background: '#141414',
    surface: '#242424',
    surfaceHover: '#2e2e2e',
    text: '#f8f9fa',
    textMuted: '#adb5bd',
    border: '#828282',
    success: '#63e6be',
    warning: '#ffd43b',
    error: '#ff8787',
    focus: '#63e6be',
    disabledBackground: '#343a40',
    disabledText: '#adb5bd',
  },
}

// Change to exampleDarkTheme to review the alternative configuration.
// Resolve by real unit ID only when the unit context is implemented.
export const activeTheme = defaultTheme
