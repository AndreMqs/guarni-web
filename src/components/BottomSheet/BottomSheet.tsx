import { Drawer } from '@mantine/core';
import type { BottomSheetProps } from './BottomSheet.types';

export function BottomSheet({ children, opened = true, onClose = () => undefined }: BottomSheetProps) {
  return <Drawer opened={opened} onClose={onClose} position="bottom" size="auto" radius="lg" withCloseButton={false}>{children}</Drawer>;
}

export type { BottomSheetProps } from './BottomSheet.types';
