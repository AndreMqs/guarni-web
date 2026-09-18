import { TextInput as MantineTextInput } from '@mantine/core'
import { forwardRef } from 'react'
import styles from './TextField.module.scss'
import type { TextFieldProps } from './TextField.types.ts'

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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
  const inputClassName = [styles.input, className].filter(Boolean).join(' ')

  return (
    <MantineTextInput
      {...inputProps}
      ref={ref}
      label={label}
      description={helperText}
      error={errorMessage}
      required={isRequired}
      withAsterisk={isRequired}
      size={size}
      classNames={{
        root: styles.root,
        label: styles.label,
        description: styles.description,
        input: inputClassName,
        error: styles.error,
      }}
    />
  )
})

export type { TextFieldProps, TextFieldSize } from './TextField.types.ts'
