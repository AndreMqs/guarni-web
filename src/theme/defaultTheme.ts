import type { GuarniTheme } from './types.ts'

export const defaultTheme: GuarniTheme = {
  colorScheme: 'light',
  primary: {
    palette: [
      '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7',
      '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab',
    ],
    shade: 8,
  },
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceHover: '#f1f3f5',
    text: '#212529',
    textMuted: '#495057',
    border: '#7b838b',
    success: '#076b4d',
    warning: '#9c4a00',
    error: '#c92a2a',
    focus: '#1971c2',
    disabledBackground: '#e9ecef',
    disabledText: '#495057',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 },
  borderWidth: 1,
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMonospace: 'ui-monospace, Consolas, monospace',
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    lineHeight: 1.55,
    headingFontWeight: 600,
    headingSizes: { h1: 34, h2: 26 },
  },
}
