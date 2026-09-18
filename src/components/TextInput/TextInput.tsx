import { TextInput as MantineTextInput } from '@mantine/core';
import type { TextInputProps } from './TextInput.types';

export function TextInput({ value, defaultValue, placeholder, readOnly = false, type = 'text', onChange, disabled = false }: TextInputProps) {
  return (
    <MantineTextInput
      value={onChange ? value : undefined}
      defaultValue={!onChange ? (value ?? defaultValue) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      type={type}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      disabled={disabled}
    />
  );
}

export type { TextInputProps } from './TextInput.types';
