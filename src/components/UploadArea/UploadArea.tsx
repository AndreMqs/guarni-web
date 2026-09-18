import { Stack } from '../Stack';
import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { UploadAreaProps } from './UploadArea.types';

export function UploadArea({ title, description, icon = '＋', onClick }: UploadAreaProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{ width: '100%', minHeight: 124, border: '1px solid var(--guarni-primary)', borderRadius: 8, padding: 18 }}
    >
      <Stack align="center" gap={6}>
        <Text size="xl" tone="primary">{icon}</Text>
        <Text weight={700} tone="primary">{title}</Text>
        {description && <Text size="xs" tone="muted">{description}</Text>}
      </Stack>
    </UnstyledButton>
  );
}

export type { UploadAreaProps } from './UploadArea.types';
