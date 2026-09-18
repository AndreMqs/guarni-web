import { Group } from '../Group';
import { Stack } from '../Stack';
import { Switch } from '../Switch';
import { Text } from '../Text';
import type { ToggleRowProps } from './ToggleRow.types';

export function ToggleRow({ title, subtitle, enabled = true }: ToggleRowProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Stack gap={0}>
        <Text weight={600}>{title}</Text>
        <Text size="sm" tone="muted">{subtitle}</Text>
      </Stack>
      <Switch defaultChecked={enabled} ariaLabel={title} />
    </Group>
  );
}

export type { ToggleRowProps } from './ToggleRow.types';
