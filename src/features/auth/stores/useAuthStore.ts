import { create } from 'zustand';
import type { User, UserState } from '../types/ui-model';

interface AuthStoreState extends UserState {
  isInitialized: boolean;
}

interface AuthStoreActions {
  setSession: (user: User | null) => void;
  clearSession: () => void;
  setInitialized: (value: boolean) => void;
}

type AuthStore = AuthStoreState & {
  actions: AuthStoreActions;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  isInitialized: false,
  user: null,

  actions: {
    setSession: (user) =>
      set({
        isLoggedIn: Boolean(user),
        user,
      }),

    clearSession: () =>
      set({
        isLoggedIn: false,
        user: null,
      }),

    setInitialized: (value) =>
      set({
        isInitialized: value,
      }),
  },
}));
