import { UnstyledButton as MantineUnstyledButton } from '@mantine/core';
import type { UnstyledButtonProps } from './UnstyledButton.types';

export function UnstyledButton({
  children,
  onClick,
  disabled,
  className,
  style,
  ariaLabel,
  ariaCurrent,
  type = 'button',
}: UnstyledButtonProps) {
  return (
    <MantineUnstyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </MantineUnstyledButton>
  );
}

export type { UnstyledButtonProps } from './UnstyledButton.types';
