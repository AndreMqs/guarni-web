import { NativeSelect } from '@mantine/core';
import type { SelectProps } from './Select.types';

export function Select({ value, options, ariaLabel }: SelectProps) {
  return <NativeSelect defaultValue={value} data={options} aria-label={ariaLabel} />;
}

export type { SelectOption, SelectProps } from './Select.types';
