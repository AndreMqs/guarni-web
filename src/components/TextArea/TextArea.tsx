import { Textarea } from '@mantine/core';
import type { TextAreaProps } from './TextArea.types';

export function TextArea({ value, defaultValue, placeholder, readOnly = false, onChange, disabled = false }: TextAreaProps) {
  return (
    <Textarea
      value={onChange ? value : undefined}
      defaultValue={!onChange ? (value ?? defaultValue) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      disabled={disabled}
      autosize
      minRows={3}
    />
  );
}

export type { TextAreaProps } from './TextArea.types';
