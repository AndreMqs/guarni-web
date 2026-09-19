import { Alert } from '@mantine/core';
import type { NoticeProps } from './Notice.types';
import { semanticColors, semanticSurface } from '../../theme/semanticColors';

export function Notice({ children, tone = 'info' }: NoticeProps) {
  return <Alert style={semanticSurface(semanticColors[tone])} styles={{ message: { color: 'inherit' } }} variant="light" radius="md">{children}</Alert>;
}

export type { NoticeProps, NoticeTone } from './Notice.types';
