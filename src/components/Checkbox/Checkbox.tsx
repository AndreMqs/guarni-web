import { Checkbox as MantineCheckbox } from '@mantine/core';
import type { CheckboxProps } from './Checkbox.types';

export function Checkbox({ label, checked, defaultChecked, onChange, disabled }: CheckboxProps) {
  return (
    <MantineCheckbox
      label={label}
      checked={checked}
      defaultChecked={checked === undefined ? defaultChecked : undefined}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      disabled={disabled}
    />
  );
}

export type { CheckboxProps } from './Checkbox.types';
