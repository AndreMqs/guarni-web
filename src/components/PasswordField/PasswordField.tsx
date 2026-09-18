import { PasswordInput as MantinePasswordInput } from '@mantine/core'
import { forwardRef, useState } from 'react'
import styles from './PasswordField.module.scss'
import type { PasswordFieldProps } from './PasswordField.types.ts'

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      className,
      errorMessage,
      helperText,
      isRequired = false,
      label,
      size = 'md',
      ...inputProps
    },
    ref,
  ) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const inputClassName = [styles.innerInput, className].filter(Boolean).join(' ')

    return (
      <MantinePasswordInput
        {...inputProps}
        ref={ref}
        aria-invalid={errorMessage ? true : undefined}
        label={label}
        description={helperText}
        error={errorMessage}
        required={isRequired}
        withAsterisk={isRequired}
        size={size}
        visible={isPasswordVisible}
        onVisibilityChange={setIsPasswordVisible}
        visibilityToggleFocusable
        visibilityToggleButtonProps={{
          'aria-label': isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha',
        }}
        classNames={{
          root: styles.root,
          label: styles.label,
          description: styles.description,
          input: styles.input,
          innerInput: inputClassName,
          visibilityToggle: styles.visibilityToggle,
          error: styles.error,
        }}
      />
    )
  },
)

export type {
  PasswordFieldProps,
  PasswordFieldSize,
} from './PasswordField.types.ts'
