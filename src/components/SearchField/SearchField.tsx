import { TextInput } from '@mantine/core';
import type { SearchFieldProps } from './SearchField.types';

export function SearchField({ placeholder, value, onChange, disabled = false }: SearchFieldProps) {
  return (
    <TextInput
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      disabled={disabled}
    />
  );
}

export type { SearchFieldProps } from './SearchField.types';
