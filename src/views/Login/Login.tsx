import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button/index.ts'
import { PasswordField } from '../../components/PasswordField/index.ts'
import { TextField } from '../../components/TextField/index.ts'
import { loginPageText } from '../../constants/login.ts'
import { loginSchema } from '../../schemas/auth.ts'
import styles from './Login.module.scss'
import type { LoginViewProps } from './Login.types.ts'

type FieldErrors = Partial<Record<'username' | 'password', string>>

export function LoginView({
  isSubmitting = false,
  submitError,
  onSubmit,
}: LoginViewProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = loginSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFieldErrors({
        username: errors.username?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setFieldErrors({})
    await onSubmit(result.data)
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <main className={styles.main}>
          <header className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">{loginPageText.brandMark}</div>
            <h1 className={styles.title}>{loginPageText.title}</h1>
            <p className={styles.subtitle}>{loginPageText.subtitle}</p>
          </header>

          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <TextField
              label={loginPageText.usernameLabel}
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              isRequired
              disabled={isSubmitting}
              errorMessage={fieldErrors.username}
              onChange={() => clearFieldError('username')}
            />
            <PasswordField
              label={loginPageText.passwordLabel}
              name="password"
              autoComplete="current-password"
              isRequired
              disabled={isSubmitting}
              errorMessage={fieldErrors.password}
              onChange={() => clearFieldError('password')}
            />

            {submitError && (
              <p className={styles.submitError} role="alert">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              isFullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {loginPageText.submitButton}
            </Button>
          </form>

          <p className={styles.demoHint}>
            {loginPageText.demoPrefix} <strong>{loginPageText.demoUsername}</strong>{' '}
            {loginPageText.demoPasswordConnector}{' '}
            <strong>{loginPageText.demoPassword}</strong>.
          </p>

          <p className={styles.accessNote}>
            {loginPageText.accessNote}
          </p>
        </main>

        <footer className={styles.footer}>{loginPageText.footer}</footer>
      </div>
    </div>
  )
}
