import { Stack } from '../Stack';
import { Text } from '../Text';
import type { TimelineProps } from './Timeline.types';

export function Timeline({ events }: TimelineProps) {
  return (
    <Stack gap="sm">
      {events.map((event) => (
        <Stack key={`${event.title}-${event.meta}`} gap={2} style={{ borderLeft: '2px solid var(--mantine-color-gray-3)', paddingLeft: 12 }}>
          <Text weight={600}>{event.title}</Text>
          <Text size="sm" tone="muted">{event.meta}</Text>
        </Stack>
      ))}
    </Stack>
  );
}

export type { TimelineEvent, TimelineProps } from './Timeline.types';
