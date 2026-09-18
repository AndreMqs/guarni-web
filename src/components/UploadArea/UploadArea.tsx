import { FileButton } from '@mantine/core';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { UploadAreaProps } from './UploadArea.types';

export function UploadArea({
  title,
  description,
  icon = '＋',
  fileName,
  accept = 'image/*',
  onFileSelect,
  disabled = false,
}: UploadAreaProps) {
  return (
    <FileButton onChange={onFileSelect ?? (() => undefined)} accept={accept} disabled={disabled}>
      {(props) => (
        <UnstyledButton
          {...props}
          disabled={disabled}
          style={{ width: '100%', minHeight: 124, border: '1px solid var(--guarni-primary)', borderRadius: 8, padding: 18 }}
        >
          <Stack align="center" gap={6}>
            <Text size="xl" tone="primary">{icon}</Text>
            <Text weight={700} tone="primary">{fileName ?? title}</Text>
            {description && <Text size="xs" tone="muted">{description}</Text>}
          </Stack>
        </UnstyledButton>
      )}
    </FileButton>
  );
}

export type { UploadAreaProps } from './UploadArea.types';
