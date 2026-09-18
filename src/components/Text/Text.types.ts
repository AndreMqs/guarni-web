import type { CSSProperties, ReactNode } from 'react';

export type TextTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextComponent = 'span' | 'p' | 'div' | 'strong';

export type TextProps = {
  children?: ReactNode;
  tone?: TextTone;
  size?: TextSize;
  weight?: 400 | 500 | 600 | 700;
  align?: 'left' | 'center' | 'right';
  component?: TextComponent;
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: string;
};
