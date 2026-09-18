export type ToggleRowProps = {
  title: string;
  subtitle: string;
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  disabled?: boolean;
};
