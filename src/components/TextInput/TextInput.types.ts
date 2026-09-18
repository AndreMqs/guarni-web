export type TextInputProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: 'text' | 'date' | 'time' | 'month';
  label?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
};
