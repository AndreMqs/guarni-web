import { Box } from '../Box';
import { Text } from '../Text';
import type { FormFieldProps } from './FormField.types';

export function FormField({ label, children }: FormFieldProps) {
  return (
    <Box>
      <Text size="sm" weight={600} style={{ marginBottom: 6 }}>{label}</Text>
      {children}
    </Box>
  );
}

export type { FormFieldProps } from './FormField.types';
