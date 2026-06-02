import { create } from 'zustand';

type ToastTone = 'default' | 'success' | 'error';
type ToastWidth = 'default' | 'wide';
type ToastPosition = 'top' | 'socialAction';

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
  width: ToastWidth;
  position: ToastPosition;
};

type ToastStore = {
  toast: Toast | null;
  showToast: (
    message: string,
    tone?: ToastTone,
    width?: ToastWidth,
    position?: ToastPosition,
  ) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message, tone = 'default', width = 'default', position = 'top') =>
    set({
      toast: {
        id: Date.now(),
        message,
        tone,
        width,
        position,
      },
    }),
  hideToast: () => set({ toast: null }),
}));
