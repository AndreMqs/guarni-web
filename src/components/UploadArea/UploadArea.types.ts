export type UploadAreaProps = {
  title: string;
  description?: string;
  icon?: string;
  fileName?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
  disabled?: boolean;
};
