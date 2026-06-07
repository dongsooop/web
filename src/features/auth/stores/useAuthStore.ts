import { create } from 'zustand';

import type { User } from '../types/ui-model';

type AuthStore = {
  user: User | null;
  isReady: boolean;
  isExpired: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setReady: () => void;
  expireSession: () => void;
  clearExpired: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isReady: false,
  isExpired: false,
  setUser: (user) =>
    set({
      user,
      isExpired: false,
    }),

  clearAuth: () =>
    set({
      user: null,
      isExpired: false,
    }),

  setReady: () =>
    set({
      isReady: true,
    }),

  expireSession: () =>
    set({
      user: null,
      isExpired: true,
      isReady: true,
    }),

  clearExpired: () =>
    set({
      isExpired: false,
    }),
}));
