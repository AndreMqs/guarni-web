import { Alert } from '@mantine/core';
import type { NoticeProps, NoticeTone } from './Notice.types';

const colors: Record<NoticeTone, string> = { info: 'blue', success: 'green', warning: 'yellow', danger: 'red' };

export function Notice({ children, tone = 'info' }: NoticeProps) {
  return <Alert color={colors[tone]} variant="light" radius="md">{children}</Alert>;
}

export type { NoticeProps, NoticeTone } from './Notice.types';
