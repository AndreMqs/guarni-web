import { useRef } from 'react';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Button } from '../Button';
import { Group } from '../Group';
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
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const selectFile = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (file) onFileSelect?.(file);
    input.value = '';
  };
  return (
    <Stack gap="sm" style={{ border: '1px solid var(--guarni-border)', borderRadius: 'var(--guarni-radius-md)', padding: 'var(--guarni-spacing-md)' }}>
      <Text weight={700}>{icon} {fileName ?? title}</Text>
      {description && <Text size="xs" tone="muted">{description}</Text>}
      <Group grow>
        <Button variant="secondary" disabled={disabled} onClick={() => cameraInput.current?.click()}>Tirar foto</Button>
        <Button variant="secondary" disabled={disabled} onClick={() => galleryInput.current?.click()}>Escolher da galeria</Button>
      </Group>
      <input ref={cameraInput} hidden type="file" aria-label="Foto da câmera" accept="image/*" capture="environment" disabled={disabled} onChange={event => selectFile(event.currentTarget)} />
      <input ref={galleryInput} hidden type="file" aria-label="Foto da galeria" accept={accept} disabled={disabled} onChange={event => selectFile(event.currentTarget)} />
    </Stack>
  );
}

export type { UploadAreaProps } from './UploadArea.types';
