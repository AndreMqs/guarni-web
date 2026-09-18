import { Box } from '../Box';
import { IconBadge } from '../IconBadge';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Title } from '../Title';
import type { SuccessStateProps } from './SuccessState.types';

export function SuccessState({ title, description, children }: SuccessStateProps) {
  return (
    <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack align="center" style={{ maxWidth: 420, width: '100%' }}>
        <IconBadge tone="success" size="lg">✓</IconBadge>
        <Title order={2}>{title}</Title>
        <Text tone="muted" align="center">{description}</Text>
        {children}
      </Stack>
    </Box>
  );
}

export type { SuccessStateProps } from './SuccessState.types';
