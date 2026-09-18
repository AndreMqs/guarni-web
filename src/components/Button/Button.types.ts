import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'color'> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isFullWidth?: boolean
  isLoading?: boolean
}
