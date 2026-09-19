import { Badge as MantineBadge } from '@mantine/core';
import type { StatusBadgeProps } from './StatusBadge.types';
import { semanticColors, semanticSurface } from '../../theme/semanticColors';
export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <MantineBadge style={semanticSurface(semanticColors[tone])} variant="light" radius="sm">{children}</MantineBadge>;
}

export type { StatusBadgeProps, StatusTone } from './StatusBadge.types';
