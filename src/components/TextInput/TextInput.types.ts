export type TextInputProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: 'text' | 'date' | 'time';
  onChange?: (value: string) => void;
  disabled?: boolean;
};
