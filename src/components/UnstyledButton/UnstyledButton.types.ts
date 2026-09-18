import type { AriaAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react';

export type UnstyledButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  ariaCurrent?: AriaAttributes['aria-current'];
  type?: 'button' | 'submit' | 'reset';
};
