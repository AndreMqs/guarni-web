import { NativeSelect } from '@mantine/core';
import type { SelectProps } from './Select.types';

export function Select({ value, options, ariaLabel, onChange, disabled = false }: SelectProps) {
  return (
    <NativeSelect
      value={onChange ? value : undefined}
      defaultValue={!onChange ? value : undefined}
      data={options}
      aria-label={ariaLabel}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      disabled={disabled}
    />
  );
}

export type { SelectOption, SelectProps } from './Select.types';
