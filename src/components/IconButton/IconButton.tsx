import { ActionIcon } from '@mantine/core';
import type { IconButtonProps } from './IconButton.types';

export function IconButton({ children, ariaLabel, onClick, disabled }: IconButtonProps) {
  return <ActionIcon variant="subtle" aria-label={ariaLabel} onClick={onClick} disabled={disabled}>{children}</ActionIcon>;
}

export type { IconButtonProps } from './IconButton.types';
