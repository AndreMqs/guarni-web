import type { MouseEventHandler, ReactNode } from 'react';

export type TextButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};
