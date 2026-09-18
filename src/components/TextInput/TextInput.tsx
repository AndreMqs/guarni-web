import { TextInput as MantineTextInput } from '@mantine/core';
import type { TextInputProps } from './TextInput.types';

export function TextInput({ value, placeholder, readOnly = false, type = 'text' }: TextInputProps) {
  return <MantineTextInput defaultValue={value} placeholder={placeholder} readOnly={readOnly} type={type} />;
}

export type { TextInputProps } from './TextInput.types';
