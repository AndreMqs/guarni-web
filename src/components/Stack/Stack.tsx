import { Stack as MantineStack } from '@mantine/core';
import type { StackProps } from './Stack.types';

export function Stack({ children, gap = 'md', align, className, style }: StackProps) {
  return <MantineStack gap={gap} align={align} className={className} style={style}>{children}</MantineStack>;
}

export type { StackProps } from './Stack.types';
