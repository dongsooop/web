import { create } from 'zustand';

interface AppCheckState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAppCheckStore = create<AppCheckState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));