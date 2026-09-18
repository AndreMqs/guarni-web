export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value?: string;
  options: SelectOption[];
  ariaLabel?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};
