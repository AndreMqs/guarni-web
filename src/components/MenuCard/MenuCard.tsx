import { Group } from '../Group';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { MenuCardProps } from './MenuCard.types';

export function MenuCard({ icon, title, subtitle, onClick }: MenuCardProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{ width: '100%', border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8, padding: 12 }}
    >
      <Group wrap="nowrap">
        <Text size="xl">{icon}</Text>
        <Stack gap={0} style={{ flex: 1 }}>
          <Text weight={600}>{title}</Text>
          <Text size="sm" tone="muted">{subtitle}</Text>
        </Stack>
        <Text>›</Text>
      </Group>
    </UnstyledButton>
  );
}

export type { MenuCardProps } from './MenuCard.types';
