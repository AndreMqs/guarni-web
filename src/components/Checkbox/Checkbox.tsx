import { Checkbox as MantineCheckbox } from '@mantine/core';
import type { CheckboxProps } from './Checkbox.types';

export function Checkbox({ label, defaultChecked, disabled }: CheckboxProps) {
  return <MantineCheckbox label={label} defaultChecked={defaultChecked} disabled={disabled} />;
}

export type { CheckboxProps } from './Checkbox.types';
