export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value?: string;
  options: SelectOption[];
  ariaLabel?: string;
};
