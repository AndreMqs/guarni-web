export const loginFieldLimits = {
  username: { minLength: 1, maxLength: 60 },
  password: { minLength: 12, maxLength: 128 },
} as const

export const usernameAllowedCharactersPattern = /^[a-z0-9._-]+$/
