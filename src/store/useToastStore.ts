import { create } from 'zustand';

type ToastTone = 'default' | 'success' | 'error';

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastStore = {
  toast: Toast | null;
  showToast: (message: string, tone?: ToastTone) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message, tone = 'default') =>
    set({
      toast: {
        id: Date.now(),
        message,
        tone,
      },
    }),
  hideToast: () => set({ toast: null }),
}));
