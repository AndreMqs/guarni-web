import type { ReactNode } from 'react';

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';

export type NoticeProps = {
  children: ReactNode;
  tone?: NoticeTone;
};
