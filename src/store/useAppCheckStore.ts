import { create } from 'zustand';

interface AppCheckState {
  token: string | null;
  isInitialized: boolean;
  setToken: (token: string | null) => void;
  setInitialized: (value: boolean) => void;
  clearToken: () => void;
}

export const useAppCheckStore = create<AppCheckState>((set) => ({
  token: null,
  isInitialized: false,
  setToken: (token) => set({ token }),
  setInitialized: (value) => set({ isInitialized: value }),
  clearToken: () => set({ token: null }),
}));