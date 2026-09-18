import type { LoginCredentials } from '../../schemas/auth.ts'

export type LoginViewProps = {
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>
}
