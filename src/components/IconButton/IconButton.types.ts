import type { MouseEventHandler, ReactNode } from 'react';

export type IconButtonProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};
