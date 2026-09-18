import { Switch as MantineSwitch } from '@mantine/core';
import type { ChangeEvent } from 'react';
import type { SwitchProps } from './Switch.types';

export function Switch({ defaultChecked, checked, onChange, disabled, ariaLabel }: SwitchProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.currentTarget.checked);
  }

  return (
    <MantineSwitch
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange ? handleChange : undefined}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}

export type { SwitchProps } from './Switch.types';
