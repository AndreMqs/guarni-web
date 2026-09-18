import type { CSSProperties, ReactNode } from 'react';

export type GroupProps = {
  children?: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
  wrap?: 'wrap' | 'nowrap';
  grow?: boolean;
  className?: string;
  style?: CSSProperties;
};
