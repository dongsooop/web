import { useCallback, useRef } from 'react';

import { useAppCheckStore } from '@/store/useAppCheckStore';

import { getSession, logout as logoutRequest, signIn as signInRequest } from '../client/auth.api';
import { toUserModel } from '../mapper';
import { useAuthStore } from '../stores/useAuthStore';

import type { SignInRequest } from '../types/request';

export function useAuth() {
  const initInFlightRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const isReady = useAuthStore((state) => state.isReady);
  const isExpired = useAuthStore((state) => state.isExpired);

  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setReady = useAuthStore((state) => state.setReady);
  const expireSession = useAuthStore((state) => state.expireSession);
  const clearExpired = useAuthStore((state) => state.clearExpired);

  // 초기 세션 상태 복원
  const initSession = useCallback(async () => {
    if (initInFlightRef.current) {
      return;
    }

    initInFlightRef.current = true;

    try {
      const appCheckToken = useAppCheckStore.getState().token;

      if (!appCheckToken) {
        return;
      }

      const session = await getSession();

      if (session?.isLoggedIn && session.user) {
        setUser(toUserModel(session.user));
        return;
      }

      clearAuth();
    } catch {
      clearAuth();
    } finally {
      setReady();
      initInFlightRef.current = false;
    }
  }, [clearAuth, setReady, setUser]);

  // 로그인 요청 및 사용자 상태 반영
  const signIn = useCallback(
    async (payload: SignInRequest) => {
      const response = await signInRequest(payload);

      if (!response?.user) {
        throw new Error('로그인 응답에 사용자 정보가 없습니다.');
      }

      setUser(toUserModel(response.user));
      clearExpired();

      return response;
    },
    [clearExpired, setUser],
  );

  // 로그아웃 요청 후 인증 상태 초기화
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
    isReady,
    isExpired,
    initSession,
    signIn,
    logout,
    expireSession,
    clearExpired,
  };
}
