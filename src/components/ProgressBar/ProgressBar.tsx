import { Progress } from '@mantine/core';
import type { ProgressBarProps } from './ProgressBar.types';

export function ProgressBar({ value }: ProgressBarProps) {
  return <Progress value={value} aria-label={`${value}% concluído`} />;
}

export type { ProgressBarProps } from './ProgressBar.types';
