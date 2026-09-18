import { Box } from '../Box';
import { Card } from '../Card';
import { Stack } from '../Stack';
import { Text } from '../Text';
import type { MediaPlaceholderProps } from './MediaPlaceholder.types';

export function MediaPlaceholder({ title, description, icon = '▧', compact = false, style }: MediaPlaceholderProps) {
  return (
    <Card
      padding={compact ? 'xs' : 'lg'}
      style={{ minHeight: compact ? 54 : 170, background: 'var(--guarni-surface-hover)', ...style }}
    >
      <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack align="center" gap={4}>
          <Text size={compact ? 'lg' : 'xl'} tone="muted">{icon}</Text>
          <Text weight={600} size={compact ? 'xs' : 'sm'} align="center">{title}</Text>
          {description && <Text size="xs" tone="muted" align="center">{description}</Text>}
        </Stack>
      </Box>
    </Card>
  );
}

export type { MediaPlaceholderProps } from './MediaPlaceholder.types';
