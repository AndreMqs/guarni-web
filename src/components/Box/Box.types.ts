import type { CSSProperties, ReactNode } from 'react';

export type BoxElement = 'div' | 'main' | 'header' | 'footer' | 'section' | 'article' | 'nav' | 'aside';

export type BoxProps = {
  children?: ReactNode;
  as?: BoxElement;
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
};
