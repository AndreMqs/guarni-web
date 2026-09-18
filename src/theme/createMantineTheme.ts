import { createTheme } from '@mantine/core'
import type { CSSVariablesResolver } from '@mantine/core'
import { defaultTheme } from './defaultTheme.ts'
import type { GuarniTheme, ThemeScale } from './types.ts'

const toRem = (value: number) => `${value / 16}rem`
const toRemScale = (scale: ThemeScale) =>
  Object.fromEntries(Object.entries(scale).map(([key, value]) => [key, toRem(value)]))

export function createMantineTheme(config: GuarniTheme = defaultTheme) {
  const { colors, primary, typography } = config
  const primaryColor = primary.palette[primary.shade]
  const theme = createTheme({
    primaryColor: 'brand',
    primaryShade: primary.shade,
    colors: { brand: [...primary.palette] },
    autoContrast: true,
    respectReducedMotion: true,
    focusClassName: 'guarni-focus',
    fontFamily: typography.fontFamily,
    fontFamilyMonospace: typography.fontFamilyMonospace,
    fontSizes: toRemScale(typography.fontSizes),
    lineHeights: { md: String(typography.lineHeight) },
    headings: {
      fontFamily: typography.fontFamily,
      fontWeight: String(typography.headingFontWeight),
      sizes: {
        h1: { fontSize: toRem(typography.headingSizes.h1) },
        h2: { fontSize: toRem(typography.headingSizes.h2) },
      },
    },
    spacing: toRemScale(config.spacing),
    radius: toRemScale(config.radius),
    defaultRadius: 'md',
  })

  const cssVariablesResolver: CSSVariablesResolver = () => {
    const variables: Record<string, string> = {
      '--guarni-primary': primaryColor,
      '--guarni-primary-hover': primary.palette[primary.shade + 1],
      '--guarni-on-primary': 'var(--mantine-primary-color-contrast)',
      '--guarni-font-family': typography.fontFamily,
      '--guarni-font-family-monospace': typography.fontFamilyMonospace,
      '--guarni-line-height': String(typography.lineHeight),
      '--guarni-heading-font-weight': String(typography.headingFontWeight),
      '--guarni-heading-size': toRem(typography.headingSizes.h1),
      '--guarni-subheading-size': toRem(typography.headingSizes.h2),
      '--guarni-border-width': toRem(config.borderWidth),
    }

    for (const [name, value] of Object.entries(colors)) {
      const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      variables[`--guarni-${cssName}`] = value
    }

    for (const [prefix, scale] of Object.entries({
      spacing: config.spacing,
      radius: config.radius,
      'font-size': typography.fontSizes,
    })) {
      for (const [size, value] of Object.entries(scale)) {
        variables[`--guarni-${prefix}-${size}`] = toRem(value)
      }
    }

    // Mantine's scheme-specific variables take precedence over :root variables.
    const semanticColors = {
      '--mantine-color-body': colors.background,
      '--mantine-color-text': colors.text,
      '--mantine-color-bright': colors.text,
      '--mantine-color-dimmed': colors.textMuted,
      '--mantine-color-placeholder': colors.textMuted,
      '--mantine-color-anchor': primaryColor,
      '--mantine-color-default': colors.surface,
      '--mantine-color-default-hover': colors.surfaceHover,
      '--mantine-color-default-color': colors.text,
      '--mantine-color-default-border': colors.border,
      '--mantine-color-error': colors.error,
      '--mantine-color-success': colors.success,
      '--mantine-color-disabled': colors.disabledBackground,
      '--mantine-color-disabled-color': colors.disabledText,
      '--mantine-color-disabled-border': colors.border,
      '--mantine-color-brand-filled': primaryColor,
      '--mantine-color-brand-filled-hover': primary.palette[primary.shade + 1],
    }

    return {
      variables,
      light: config.colorScheme === 'light' ? semanticColors : {},
      dark: config.colorScheme === 'dark' ? semanticColors : {},
    }
  }

  return { theme, cssVariablesResolver, forceColorScheme: config.colorScheme }
}
