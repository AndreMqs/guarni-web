import { Avatar as MantineAvatar } from '@mantine/core';
import type { AvatarProps } from './Avatar.types';

const sizes = { sm: 32, md: 38, lg: 46 } as const;

export function Avatar({ initials, size = 'md' }: AvatarProps) {
  return <MantineAvatar size={sizes[size]} radius="xl" color="blue" variant="light">{initials}</MantineAvatar>;
}

export type { AvatarProps } from './Avatar.types';
