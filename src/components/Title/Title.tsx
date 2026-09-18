import { Title as MantineTitle } from '@mantine/core';
import type { TitleProps } from './Title.types';

export function Title({ children, order = 2, className, style, id }: TitleProps) {
  return <MantineTitle order={order} className={className} style={style} id={id}>{children}</MantineTitle>;
}

export type { TitleProps } from './Title.types';
