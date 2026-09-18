import type { ReactNode } from 'react';

export type DetailRow = {
  label: string;
  value: ReactNode;
};

export type DetailRowsProps = {
  rows: DetailRow[];
};
