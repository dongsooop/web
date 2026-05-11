export type DateTimePickerProps = {
  open: boolean;
  title: string;
  value: Date;
  minDate?: Date;
  onCloseAction: () => void;
  onConfirmAction: (value: Date) => void;
};

export type WheelItem = {
  key: string;
  value: string;
  label: string;
};

export type WheelProps = {
  items: WheelItem[];
  value: string;
  loop?: boolean;
  widthClassName?: string;
  onChangeAction: (value: string) => void;
};
