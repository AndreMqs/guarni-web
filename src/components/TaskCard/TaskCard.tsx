import { Card } from '../Card';
import { Group } from '../Group';
import { Stack } from '../Stack';
import { StatusBadge } from '../StatusBadge';
import { Text } from '../Text';
import type { TaskCardProps } from './TaskCard.types';

export function TaskCard({ title, status = 'Pendente', tone = 'pending', due, assignee, evidence, onClick, action }: TaskCardProps) {
  return (
    <Card onClick={onClick}>
      <Stack gap="xs">
        <Group justify="space-between">
          <StatusBadge tone={tone}>{status}</StatusBadge>
          {due && <Text size="sm" tone="muted">{due}</Text>}
        </Group>
        <Text weight={700}>{title}</Text>
        {assignee && <Text size="sm" tone="muted">Responsável: {assignee}</Text>}
        {evidence && <Text size="sm" tone="muted">{evidence}</Text>}
        {action}
      </Stack>
    </Card>
  );
}

export type { TaskCardProps } from './TaskCard.types';
