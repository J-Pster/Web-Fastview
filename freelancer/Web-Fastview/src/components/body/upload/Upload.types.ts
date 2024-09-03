export interface Config {
  maxZoom: number;
  aspectRatio: number;
}

export interface CallbackProps {
  file: File;
  error: unknown;
  response: unknown;
}

export interface UploadProps {
  type: "image" | "file";
  iconSrc: string;
  callback: (response: CallbackProps) => unknown;
  config: Config;
}

export interface CropperProps {
  src: string;
  name: string;
  onSave: (file: File) => void;
  config: Config;
}
