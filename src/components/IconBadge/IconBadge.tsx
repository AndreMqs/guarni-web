import { ThemeIcon } from '@mantine/core';
import type { IconBadgeProps } from './IconBadge.types';
import { semanticColors, semanticSurface } from '../../theme/semanticColors';

const sizes = { md: 40, lg: 56 } as const;

export function IconBadge({ children, tone = 'primary', size = 'md' }: IconBadgeProps) {
  return (
    <ThemeIcon style={semanticSurface(semanticColors[tone])} variant="light" size={sizes[size]} radius="xl">
      {children}
    </ThemeIcon>
  );
}

export type { IconBadgeProps, IconBadgeTone } from './IconBadge.types';
