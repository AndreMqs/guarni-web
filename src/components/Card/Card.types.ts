import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

export type CardProps = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  padding?: 'xs' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  withBorder?: boolean;
  ariaLabel?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
};
