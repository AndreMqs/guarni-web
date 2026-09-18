import type { CSSProperties, ReactNode } from 'react';

export type SectionProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabelledBy?: string;
};
