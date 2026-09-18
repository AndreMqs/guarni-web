import { Group } from '../Group';
import { Stack } from '../Stack';
import { Text } from '../Text';
import type { SummaryMetricsProps, SummaryMetricTone } from './SummaryMetrics.types';

const toneMap: Record<SummaryMetricTone, 'danger' | 'success' | 'warning'> = {
  danger: 'danger',
  success: 'success',
  warning: 'warning',
};

export function SummaryMetrics({ label, values }: SummaryMetricsProps) {
  return (
    <Stack gap="xs">
      {label && <Text size="sm" tone="muted">{label}</Text>}
      <Group grow>
        {values.map((item) => (
          <Stack key={item.label} gap={0} align="center">
            <Text weight={700} size="xl" tone={item.tone ? toneMap[item.tone] : 'default'}>{item.value}</Text>
            <Text size="xs" tone="muted">{item.label}</Text>
          </Stack>
        ))}
      </Group>
    </Stack>
  );
}

export type { SummaryMetric, SummaryMetricsProps, SummaryMetricTone } from './SummaryMetrics.types';
