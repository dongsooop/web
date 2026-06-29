import { create } from 'zustand';
import type { User } from '../types/ui-model';
import type { AuthError, AuthErrorContext } from '../types/error';

export type AuthState = {
  user: User | null;
  isReady: boolean;
  isExpired: boolean;
  error: AuthError;
  errorContext: AuthErrorContext | null;
};

type AuthActions = {
  setUser: (user: User) => void;
  clearAuth: () => void;
  setReady: () => void;
  expireSession: () => void;
  clearExpired: () => void;
  setError: (error: AuthError, errorContext: AuthErrorContext | null) => void;
};

export type AuthStore = AuthState & {
  actions: AuthActions;
};

const initialState: AuthState = {
  user: null,
  isReady: false,
  isExpired: false,
  error: null,
  errorContext: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  actions: {
    setUser: (user) =>
      set({
        user,
        isExpired: false,
        error: null,
        errorContext: null,
      }),

    clearAuth: () =>
      set({
        user: null,
        isExpired: false,
        error: null,
        errorContext: null,
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
        error: null,
        errorContext: null,
      }),

    clearExpired: () =>
      set({
        isExpired: false,
      }),

    setError: (error, errorContext) =>
      set({
        error,
        errorContext,
      }),
  },
}));
