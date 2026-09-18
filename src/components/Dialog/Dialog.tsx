import { Modal } from '@mantine/core';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Title } from '../Title';
import type { DialogProps } from './Dialog.types';

export function Dialog({ title, children, action, onAction, opened = true, onClose = () => undefined }: DialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack>
        <Title order={3}>{title}</Title>
        <Text tone="muted" size="sm">{children}</Text>
        {action && <Button isFullWidth onClick={onAction}>{action}</Button>}
      </Stack>
    </Modal>
  );
}

export type { DialogProps } from './Dialog.types';
