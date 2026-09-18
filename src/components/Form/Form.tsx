import { Box } from '@mantine/core';
import type { FormProps } from './Form.types';

export function Form({ children, className, onSubmit, noValidate = true }: FormProps) {
  return <Box component="form" className={className} onSubmit={onSubmit} noValidate={noValidate}>{children}</Box>;
}

export type { FormProps } from './Form.types';
