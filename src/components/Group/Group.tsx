import { Group as MantineGroup } from '@mantine/core';
import type { GroupProps } from './Group.types';

export function Group({ children, gap = 'md', justify, align = 'center', wrap = 'wrap', grow, className, style }: GroupProps) {
  return <MantineGroup gap={gap} justify={justify} align={align} wrap={wrap} grow={grow} className={className} style={style}>{children}</MantineGroup>;
}

export type { GroupProps } from './Group.types';
