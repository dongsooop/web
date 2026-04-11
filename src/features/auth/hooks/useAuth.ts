import { useCallback, useRef } from 'react';

import { useAppCheckStore } from '@/store/useAppCheckStore';

import { getSession, logout as logoutRequest, signIn as signInRequest } from '../client/auth.api';
import { toUserModel } from '../mapper';
import { useAuthStore } from '../stores/useAuthStore';

import type { SignInRequest } from '../types/request';

export function useAuth() {
  const initializeInFlightRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);

  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const markInitialized = useAuthStore((state) => state.markInitialized);
  const markSessionExpired = useAuthStore((state) => state.markSessionExpired);
  const clearSessionExpired = useAuthStore((state) => state.clearSessionExpired);

  const initializeSession = useCallback(async () => {
    if (initializeInFlightRef.current) {
      return;
    }

    initializeInFlightRef.current = true;

    try {
      const appCheckToken = useAppCheckStore.getState().token;

      if (!appCheckToken) {
        return;
      }

      const session = await getSession();

      if (session?.isLoggedIn && session.user) {
        setAuthenticatedUser(toUserModel(session.user));
        return;
      }

      clearAuth();
    } catch {
      clearAuth();
    } finally {
      markInitialized();
      initializeInFlightRef.current = false;
    }
  }, [clearAuth, markInitialized, setAuthenticatedUser]);

  const signIn = useCallback(
    async (payload: SignInRequest) => {
      const response = await signInRequest(payload);

      if (!response?.user) {
        throw new Error('로그인 응답에 사용자 정보가 없습니다.');
      }

      setAuthenticatedUser(toUserModel(response.user));
      clearSessionExpired();

      return response;
    },
    [clearSessionExpired, setAuthenticatedUser],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  return {
    user,
    isLoggedIn: !!user,
    isInitialized,
    isSessionExpired,
    initializeSession,
    signIn,
    logout,
    markSessionExpired,
    clearSessionExpired,
  };
}
