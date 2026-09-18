export const loginFieldLimits = {
  username: { minLength: 1, maxLength: 60 },
  password: { minLength: 12, maxLength: 128 },
} as const

export const usernameAllowedCharactersPattern = /^[a-z0-9._-]+$/

export const loginValidationMessages = {
  usernameRequired: 'Informe o usuário.',
  usernameTooLong: `O usuário deve ter no máximo ${loginFieldLimits.username.maxLength} caracteres.`,
  usernameInvalidCharacters:
    'Use apenas letras sem acento, números, ponto, hífen ou sublinhado.',
  passwordRequired: 'Informe a senha.',
  passwordTooShort: `A senha deve ter pelo menos ${loginFieldLimits.password.minLength} caracteres.`,
  passwordTooLong: `A senha deve ter no máximo ${loginFieldLimits.password.maxLength} caracteres.`,
} as const
