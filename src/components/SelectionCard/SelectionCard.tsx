import { Avatar } from '../Avatar';
import { Group } from '../Group';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { SelectionCardProps } from './SelectionCard.types';

export function SelectionCard({ title, subtitle, icon, initials, isSelected = false, onClick }: SelectionCardProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{ width: '100%', border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8, padding: 12 }}
    >
      <Group wrap="nowrap">
        <Avatar initials={initials ?? icon ?? '?'} />
        <Stack gap={0} style={{ flex: 1 }}>
          <Text weight={600}>{title}</Text>
          {subtitle && <Text size="sm" tone="muted">{subtitle}</Text>}
        </Stack>
        <Text tone={isSelected ? 'primary' : 'muted'}>{isSelected ? '✓' : '›'}</Text>
      </Group>
    </UnstyledButton>
  );
}

export type { SelectionCardProps } from './SelectionCard.types';
