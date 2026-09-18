export type TextAreaProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
};
