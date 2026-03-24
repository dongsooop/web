'use client';

import { AuthUser } from '@/features/auth/types';
import { create } from 'zustand';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
