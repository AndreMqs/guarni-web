export type ColorPalette = readonly [
  string, string, string, string, string,
  string, string, string, string, string,
]

export type ThemeScale = Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>

export type GuarniTheme = {
  colorScheme: 'light' | 'dark'
  primary: {
    palette: ColorPalette
    // The next shade is reserved for hover.
    shade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  }
  colors: {
    background: string
    surface: string
    surfaceHover: string
    text: string
    textMuted: string
    border: string
    success: string
    warning: string
    error: string
    focus: string
    disabledBackground: string
    disabledText: string
  }
  spacing: ThemeScale
  radius: ThemeScale
  borderWidth: number
  typography: {
    fontFamily: string
    fontFamilyMonospace: string
    fontSizes: ThemeScale
    lineHeight: number
    headingFontWeight: number
    headingSizes: { h1: number; h2: number }
  }
}
