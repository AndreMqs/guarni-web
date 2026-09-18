import type { ComponentPropsWithoutRef } from 'react'

export type PasswordFieldSize = 'sm' | 'md' | 'lg'

export type PasswordFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'color' | 'required' | 'size' | 'type'
> & {
  label: string
  helperText?: string
  errorMessage?: string
  isRequired?: boolean
  size?: PasswordFieldSize
}
