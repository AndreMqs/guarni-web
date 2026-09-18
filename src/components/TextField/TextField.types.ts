import type { ComponentPropsWithoutRef } from 'react'

export type TextFieldSize = 'sm' | 'md' | 'lg'

export type TextFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'color' | 'required' | 'size'
> & {
  label: string
  helperText?: string
  errorMessage?: string
  isRequired?: boolean
  size?: TextFieldSize
}
