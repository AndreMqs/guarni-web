import { useState, type FormEvent } from 'react';
import { Box, Button, Form, Group, PasswordField, Text, TextField, Title } from '../../components';
import { loginPageText } from '../../constants/login.ts';
import { loginSchema } from '../../schemas/auth.ts';
import styles from './Login.module.scss';
import type { LoginViewProps } from './Login.types.ts';

type FieldErrors = Partial<Record<'username' | 'password', string>>;

export function LoginView({ isSubmitting = false, submitError, onSubmit }: LoginViewProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => current[field] ? { ...current, [field]: undefined } : current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = loginSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        username: errors.username?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setFieldErrors({});
    await onSubmit(result.data);
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.shell}>
        <Box as="main" className={styles.main}>
          <Box as="header" className={styles.brand}>
            <Box className={styles.brandMark} ariaHidden>{loginPageText.brandMark}</Box>
            <Title order={1} className={styles.title}>{loginPageText.title}</Title>
            <Text component="p" className={styles.subtitle}>{loginPageText.subtitle}</Text>
          </Box>

          <Form className={styles.form} noValidate onSubmit={handleSubmit}>
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

            {submitError && <Text component="p" className={styles.submitError} role="alert">{submitError}</Text>}

            <Button type="submit" isFullWidth isLoading={isSubmitting} disabled={isSubmitting}>
              {loginPageText.submitButton}
            </Button>
          </Form>

          <Group gap={4} className={styles.demoHint}>
            <Text>{loginPageText.demoPrefix}</Text>
            <Text weight={700}>{loginPageText.demoUsername}</Text>
            <Text>{loginPageText.demoPasswordConnector}</Text>
            <Text weight={700}>{loginPageText.demoPassword}.</Text>
          </Group>

          <Text component="p" className={styles.accessNote}>{loginPageText.accessNote}</Text>
        </Box>

        <Box as="footer" className={styles.footer}>{loginPageText.footer}</Box>
      </Box>
    </Box>
  );
}
