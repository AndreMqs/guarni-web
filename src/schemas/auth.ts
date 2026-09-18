import { z } from 'zod'
import {
  loginFieldLimits,
  loginValidationMessages,
  usernameAllowedCharactersPattern,
} from '../constants/auth.ts'

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(loginFieldLimits.username.minLength, loginValidationMessages.usernameRequired)
  .max(
    loginFieldLimits.username.maxLength,
    loginValidationMessages.usernameTooLong,
  )
  .regex(
    usernameAllowedCharactersPattern,
    loginValidationMessages.usernameInvalidCharacters,
  )

const passwordSchema = z
  .string()
  .min(1, loginValidationMessages.passwordRequired)
  .min(
    loginFieldLimits.password.minLength,
    loginValidationMessages.passwordTooShort,
  )
  .max(
    loginFieldLimits.password.maxLength,
    loginValidationMessages.passwordTooLong,
  )

export const loginSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.input<typeof loginSchema>
export type LoginCredentials = z.output<typeof loginSchema>
