import { create } from 'zustand';

type ToastTone = 'default' | 'success' | 'error';
type ToastWidth = 'default' | 'wide';
type ToastPosition = 'top' | 'socialAction';

type Toast = {
  className?: string;
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
    option?: ToastWidth | string,
    position?: ToastPosition,
  ) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message, tone = 'default', option, position = 'top') => {
    const width = option === 'wide' || option === 'default' ? option : 'default';
    const className = typeof option === 'string' && option !== 'wide' && option !== 'default' ? option : undefined;

    return set({
      toast: {
        className,
        id: Date.now(),
        message,
        tone,
        width,
        position,
      },
    });
  },
  hideToast: () => set({ toast: null }),
}));
