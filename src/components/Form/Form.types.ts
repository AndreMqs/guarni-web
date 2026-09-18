import type { FormEventHandler, ReactNode } from 'react';

export type FormProps = {
  children: ReactNode;
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  noValidate?: boolean;
};
