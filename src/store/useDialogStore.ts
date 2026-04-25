import { create } from 'zustand';

type DialogVariant = 'primary' | 'danger';

type DialogOptions = {
  title: string;
  content: string;
  cancel?: string;
  confirm?: string;
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  isSingleAction?: boolean;
  variant?: DialogVariant;
};

type DialogStore = {
  dialog: DialogOptions | null;
  showDialog: (dialog: DialogOptions) => void;
  hideDialog: () => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  dialog: null,
  showDialog: (dialog) => set({ dialog }),
  hideDialog: () => set({ dialog: null }),
}));
