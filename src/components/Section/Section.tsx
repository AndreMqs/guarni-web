import { Box } from '@mantine/core';
import type { SectionProps } from './Section.types';

export function Section({ children, className, style, ariaLabelledBy }: SectionProps) {
  return <Box component="section" className={className} style={style} aria-labelledby={ariaLabelledBy}>{children}</Box>;
}

export type { SectionProps } from './Section.types';
