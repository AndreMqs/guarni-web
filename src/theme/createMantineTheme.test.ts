import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { DEFAULT_THEME, defaultCssVariablesResolver, mergeMantineTheme } from '@mantine/core'
import { createMantineTheme } from './createMantineTheme.ts'
import { defaultTheme } from './defaultTheme.ts'
import { exampleDarkTheme } from './restaurantThemes.ts'
import type { GuarniTheme } from './types.ts'

const getVariables = (config?: GuarniTheme): Record<string, string> => {
  const adapter = createMantineTheme(config)
  const theme = mergeMantineTheme(DEFAULT_THEME, adapter.theme)
  const base = defaultCssVariablesResolver(theme)
  const custom = adapter.cssVariablesResolver(theme)
  return {
    ...base.variables,
    ...custom.variables,
    ...base[adapter.forceColorScheme],
    ...custom[adapter.forceColorScheme],
  }
}

const resolveColor = (variables: Record<string, string>, name: string): string => {
  const value = variables[name]
  assert.ok(value, `Missing variable: ${name}`)
  const reference = /^var\((--[\w-]+)\)$/.exec(value)
  return reference ? resolveColor(variables, reference[1]) : value
}

const luminance = (hex: string) => {
  assert.match(hex, /^#[\da-f]{3}([\da-f]{3})?$/i)
  const value = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1)
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

const assertContrast = (foreground: string, background: string, minimum = 4.5) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  const ratio = (values[0] + 0.05) / (values[1] + 0.05)
  assert.ok(ratio >= minimum, `${foreground} on ${background}: ${ratio.toFixed(2)} < ${minimum}`)
}

test('uses the light fallback when no configuration is supplied', () => {
  assert.equal(createMantineTheme().forceColorScheme, 'light')
  assert.deepEqual(getVariables(), getVariables(defaultTheme))
})

for (const config of [defaultTheme, exampleDarkTheme]) {
  test(`${config.colorScheme}: shares semantic colors between CSS and Mantine`, () => {
    const variables = getVariables(config)
    for (const [mantineName, guarniName] of [
      ['body', 'background'], ['text', 'text'], ['dimmed', 'text-muted'],
      ['default', 'surface'], ['default-border', 'border'], ['error', 'error'],
      ['success', 'success'], ['disabled', 'disabled-background'],
      ['disabled-color', 'disabled-text'], ['brand-filled', 'primary'],
      ['brand-filled-hover', 'primary-hover'],
    ]) {
      assert.equal(resolveColor(variables, `--mantine-color-${mantineName}`),
        resolveColor(variables, `--guarni-${guarniName}`))
    }
    assert.equal(createMantineTheme(config).forceColorScheme, config.colorScheme)
  })

  test(`${config.colorScheme}: maintains contrast for text, states and focus`, () => {
    const variables = getVariables(config)
    const color = (name: string) => resolveColor(variables, `--guarni-${name}`)
    for (const background of ['background', 'surface', 'surface-hover']) {
      for (const foreground of ['text', 'text-muted', 'primary', 'success', 'warning', 'error']) {
        assertContrast(color(foreground), color(background))
      }
      assertContrast(color('focus'), color(background), 3)
      assertContrast(color('border'), color(background), 3)
    }
    assertContrast(color('on-primary'), color('primary'))
    assertContrast(color('on-primary'), color('primary-hover'))
    assertContrast(color('disabled-text'), color('disabled-background'))
  })
}

test('adapts a changed palette and dimensions without mutating the configuration', () => {
  const config = structuredClone(exampleDarkTheme)
  config.primary.shade = 5
  config.spacing.md = 20
  config.radius.md = 10
  config.typography.fontSizes.md = 18
  config.typography.fontFamily = 'Arial, sans-serif'
  const before = structuredClone(config)
  const adapter = createMantineTheme(config)
  const variables = getVariables(config)
  assert.equal(variables['--guarni-primary'], config.primary.palette[5])
  assert.equal(variables['--guarni-primary-hover'], config.primary.palette[6])
  assert.equal(adapter.theme.spacing?.md, '1.25rem')
  assert.equal(variables['--guarni-spacing-md'], '1.25rem')
  assert.equal(adapter.theme.radius?.md, '0.625rem')
  assert.equal(variables['--guarni-radius-md'], '0.625rem')
  assert.equal(adapter.theme.fontSizes?.md, '1.125rem')
  assert.equal(variables['--guarni-font-size-md'], '1.125rem')
  assert.equal(adapter.theme.fontFamily, 'Arial, sans-serif')
  assert.deepEqual(config, before)
})

test('provides every Guarni variable referenced by the current styles', () => {
  for (const config of [defaultTheme, exampleDarkTheme]) {
    const variables = getVariables(config)
    for (const file of ['../index.css', '../App.css']) {
      const css = readFileSync(new URL(file, import.meta.url), 'utf8')
      for (const [, name] of css.matchAll(/var\((--guarni-[\w-]+)\)/g)) {
        assert.ok(variables[name], `${config.colorScheme}: undefined ${name} in ${file}`)
      }
    }
  }
})
