import { expect, test } from 'vitest'
import { loginFieldLimits } from '../constants/auth.ts'
import { loginSchema } from './loginSchema.ts'

const validCredentials = {
  username: 'andre.camara',
  password: 'MinhaSenhaDeTeste123!',
}

test('accepts credentials that match the current API contract', () => {
  expect(loginSchema.parse(validCredentials)).toEqual(validCredentials)
})

test('normalizes username without changing the password', () => {
  const credentials = loginSchema.parse({
    username: '  Andre.Camara  ',
    password: '  senha com espaços  ',
  })

  expect(credentials).toEqual({
    username: 'andre.camara',
    password: '  senha com espaços  ',
  })
})

test('requires both login fields with messages in Portuguese', () => {
  const result = loginSchema.safeParse({ username: '   ', password: '' })

  expect(result.success).toBe(false)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    expect(errors.username?.[0]).toBe('Informe o usuário.')
    expect(errors.password?.[0]).toBe('Informe a senha.')
  }
})

test('rejects username characters not accepted by the API', () => {
  const result = loginSchema.safeParse({ ...validCredentials, username: 'andré@guarni' })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.flatten().fieldErrors.username?.[0]).toBe(
      'Use apenas letras sem acento, números, ponto, hífen ou sublinhado.',
    )
  }
})

test('enforces the current username length limit', () => {
  const result = loginSchema.safeParse({
    ...validCredentials,
    username: 'a'.repeat(loginFieldLimits.username.maxLength + 1),
  })

  expect(result.success).toBe(false)
})

test('enforces the current password length limits', () => {
  const shortPassword = loginSchema.safeParse({
    ...validCredentials,
    password: 'a'.repeat(loginFieldLimits.password.minLength - 1),
  })
  const longPassword = loginSchema.safeParse({
    ...validCredentials,
    password: 'a'.repeat(loginFieldLimits.password.maxLength + 1),
  })

  expect(shortPassword.success).toBe(false)
  expect(longPassword.success).toBe(false)
})

test('rejects fields outside the login request contract', () => {
  const result = loginSchema.safeParse({ ...validCredentials, rememberMe: true })

  expect(result.success).toBe(false)
})
