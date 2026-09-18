import { Box } from '../Box';
import { IconBadge } from '../IconBadge';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Title } from '../Title';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({ icon = '✓', title, description, children }: EmptyStateProps) {
  return (
    <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack align="center" style={{ maxWidth: 420, width: '100%' }}>
        <IconBadge size="lg">{icon}</IconBadge>
        <Title order={2}>{title}</Title>
        <Text tone="muted" align="center">{description}</Text>
        {children}
      </Stack>
    </Box>
  );
}

export type { EmptyStateProps } from './EmptyState.types';
