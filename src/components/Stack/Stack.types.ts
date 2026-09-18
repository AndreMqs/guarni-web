import type { CSSProperties, ReactNode } from 'react';

export type StackProps = {
  children?: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
  className?: string;
  style?: CSSProperties;
};
