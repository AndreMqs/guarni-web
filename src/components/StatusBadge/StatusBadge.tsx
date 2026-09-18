import { Badge as MantineBadge } from '@mantine/core';
import type { StatusBadgeProps, StatusTone } from './StatusBadge.types';
const colors: Record<StatusTone, string> = { pending: 'yellow', done: 'green', danger: 'red', warning: 'orange', neutral: 'gray' };
export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <MantineBadge color={colors[tone]} variant="light" radius="sm">{children}</MantineBadge>;
}

export type { StatusBadgeProps, StatusTone } from './StatusBadge.types';
