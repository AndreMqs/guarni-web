import { TextInput } from '@mantine/core';
import type { SearchFieldProps } from './SearchField.types';

export function SearchField({ placeholder }: SearchFieldProps) {
  return <TextInput placeholder={placeholder} aria-label={placeholder} />;
}

export type { SearchFieldProps } from './SearchField.types';
