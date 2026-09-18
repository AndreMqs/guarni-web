export type SummaryMetricTone = 'danger' | 'success' | 'warning';

export type SummaryMetric = {
  value: string | number;
  label: string;
  tone?: SummaryMetricTone;
};

export type SummaryMetricsProps = {
  label?: string;
  values: SummaryMetric[];
};
