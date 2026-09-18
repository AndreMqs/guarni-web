import { Button as MantineButton } from '@mantine/core'
import { forwardRef } from 'react'
import styles from './Button.module.scss'
import type { ButtonProps } from './Button.types.ts'

const variantClasses = {
  primary: styles.primary,
  secondary: styles.secondary,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isFullWidth = false,
    isLoading = false,
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  const rootClassName = [styles.root, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <MantineButton
      {...buttonProps}
      ref={ref}
      type={type}
      size={size}
      fullWidth={isFullWidth}
      loading={isLoading}
      aria-busy={isLoading || undefined}
      className={rootClassName}
    >
      {children}
    </MantineButton>
  )
})

export type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types.ts'
