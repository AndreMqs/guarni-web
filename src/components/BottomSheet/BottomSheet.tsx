import { Drawer } from '@mantine/core';
import type { BottomSheetProps } from './BottomSheet.types';

export function BottomSheet({ children, title, opened = true, onClose = () => undefined }: BottomSheetProps) {
  return <Drawer title={title} opened={opened} onClose={onClose} position="bottom" size="auto" radius="lg" withCloseButton={Boolean(title)} closeButtonProps={{ 'aria-label': 'Fechar' }}>{children}</Drawer>;
}

export type { BottomSheetProps } from './BottomSheet.types';
