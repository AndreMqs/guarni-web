import { Group } from '../Group';
import { Stack } from '../Stack';
import { Text } from '../Text';
import type { DetailRowsProps } from './DetailRows.types';

export function DetailRows({ rows }: DetailRowsProps) {
  return (
    <Stack gap="xs">
      {rows.map((row) => (
        <Group key={row.label} justify="space-between" align="flex-start">
          <Text size="sm" tone="muted">{row.label}</Text>
          <Text size="sm" weight={600}>{row.value}</Text>
        </Group>
      ))}
    </Stack>
  );
}

export type { DetailRow, DetailRowsProps } from './DetailRows.types';
