import { ThemeIcon } from '@mantine/core';
import type { IconBadgeProps, IconBadgeTone } from './IconBadge.types';

const colors: Record<IconBadgeTone, string> = {
  neutral: 'gray',
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
};

const sizes = { md: 40, lg: 56 } as const;

export function IconBadge({ children, tone = 'primary', size = 'md' }: IconBadgeProps) {
  return (
    <ThemeIcon color={colors[tone]} variant="light" size={sizes[size]} radius="xl">
      {children}
    </ThemeIcon>
  );
}

export type { IconBadgeProps, IconBadgeTone } from './IconBadge.types';
