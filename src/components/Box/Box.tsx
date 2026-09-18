import { Box as MantineBox } from '@mantine/core';
import type { BoxProps } from './Box.types';

export function Box({ children, as = 'div', className, style, id, role, ariaHidden, ariaLabel }: BoxProps) {
  return (
    <MantineBox
      component={as}
      className={className}
      style={style}
      id={id}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {children}
    </MantineBox>
  );
}

export type { BoxElement, BoxProps } from './Box.types';
