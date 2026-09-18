import { Textarea } from '@mantine/core';
import type { TextAreaProps } from './TextArea.types';

export function TextArea({ value, placeholder, readOnly = false }: TextAreaProps) {
  return <Textarea defaultValue={value} placeholder={placeholder} readOnly={readOnly} autosize minRows={3} />;
}

export type { TextAreaProps } from './TextArea.types';
