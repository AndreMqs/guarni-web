import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { TextButtonProps } from './TextButton.types';

export function TextButton({ children, onClick, disabled }: TextButtonProps) {
  return (
    <UnstyledButton onClick={onClick} disabled={disabled}>
      <Text size="xs" weight={700} tone="primary">{children}</Text>
    </UnstyledButton>
  );
}

export type { TextButtonProps } from './TextButton.types';
