import { z } from 'zod'
import {
  loginFieldLimits,
  usernameAllowedCharactersPattern,
} from '../constants/auth.ts'

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(loginFieldLimits.username.minLength, 'Informe o usuário.')
  .max(
    loginFieldLimits.username.maxLength,
    `O usuário deve ter no máximo ${loginFieldLimits.username.maxLength} caracteres.`,
  )
  .regex(
    usernameAllowedCharactersPattern,
    'Use apenas letras sem acento, números, ponto, hífen ou sublinhado.',
  )

const passwordSchema = z
  .string()
  .min(1, 'Informe a senha.')
  .min(
    loginFieldLimits.password.minLength,
    `A senha deve ter pelo menos ${loginFieldLimits.password.minLength} caracteres.`,
  )
  .max(
    loginFieldLimits.password.maxLength,
    `A senha deve ter no máximo ${loginFieldLimits.password.maxLength} caracteres.`,
  )

export const loginSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.input<typeof loginSchema>
export type LoginCredentials = z.output<typeof loginSchema>
