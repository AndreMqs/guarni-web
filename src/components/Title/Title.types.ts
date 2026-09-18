import type { CSSProperties, ReactNode } from 'react';

export type TitleProps = {
  children: ReactNode;
  order?: 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
  id?: string;
};
