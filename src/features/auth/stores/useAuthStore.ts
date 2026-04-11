import { create } from 'zustand';

import type { User } from '../types/ui-model';

type AuthStore = {
  user: User | null;
  isInitialized: boolean;
  isSessionExpired: boolean;

  setAuthenticatedUser: (user: User) => void;
  clearAuth: () => void;
  markInitialized: () => void;
  markSessionExpired: () => void;
  clearSessionExpired: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isInitialized: false,
  isSessionExpired: false,

  setAuthenticatedUser: (user) =>
    set({
      user,
      isSessionExpired: false,
      isInitialized: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isSessionExpired: false,
    }),

  markInitialized: () =>
    set({
      isInitialized: true,
    }),

  markSessionExpired: () =>
    set({
      user: null,
      isSessionExpired: true,
      isInitialized: true,
    }),

  clearSessionExpired: () =>
    set({
      isSessionExpired: false,
    }),
}));