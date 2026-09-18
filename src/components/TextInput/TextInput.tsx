import { TextInput as MantineTextInput } from '@mantine/core';
import type { TextInputProps } from './TextInput.types';

export function TextInput({ value, defaultValue, placeholder, readOnly = false, type = 'text', onChange, disabled = false, label, required }: TextInputProps) {
  return (
    <MantineTextInput
      label={label}
      required={required}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      styles={readOnly ? { input: { backgroundColor: 'var(--mantine-color-gray-1)', color: 'var(--mantine-color-dimmed)', cursor: 'default' } } : undefined}
      type={type}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      disabled={disabled}
    />
  );
}

export type { TextInputProps } from './TextInput.types';
