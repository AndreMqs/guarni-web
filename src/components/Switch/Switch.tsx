import { Switch as MantineSwitch } from '@mantine/core';
import type { SwitchProps } from './Switch.types';

export function Switch({ checked, defaultChecked, onChange, ariaLabel, disabled = false }: SwitchProps) {
  return (
    <MantineSwitch
      checked={checked}
      defaultChecked={checked === undefined ? defaultChecked : undefined}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      aria-label={ariaLabel}
      disabled={disabled}
    />
  );
}

export type { SwitchProps } from './Switch.types';
