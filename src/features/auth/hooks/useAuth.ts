import { useCallback, useMemo, useRef, useState } from 'react';

import { getSession, logout as logoutRequest, signIn as signInRequest } from '../client/auth.api';
import { toUserModel } from '../mapper';
import { useAuthStore } from '../stores/useAuthStore';

import type { SignInRequest } from '../types/request';
import { useAppCheckStore } from '@/store/useAppCheckStore';

type UseAuthLoadingState = {
  initializing: boolean;
  signingIn: boolean;
  loggingOut: boolean;
};

export function useAuth() {
  const [loading, setLoading] = useState<UseAuthLoadingState>({
    initializing: false,
    signingIn: false,
    loggingOut: false,
  });

  const logoutInFlightRef = useRef(false);
  const signInInFlightRef = useRef(false);
  const initializeInFlightRef = useRef(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);

  const { setSession, clearSession, setInitialized } = useAuthStore((state) => state.actions);

  const setLoadingState = useCallback((key: keyof UseAuthLoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const initializeSession = useCallback(async () => {
    if (initializeInFlightRef.current) return;

    initializeInFlightRef.current = true;
    setLoadingState('initializing', true);

    try {
      const token = useAppCheckStore.getState().token;

      if (!token) {
        return;
      }

      const session = await getSession();

      if (session?.isLoggedIn && session.user) {
        setSession(toUserModel(session.user));
        return;
      }

      clearSession();
    } catch {
      clearSession();
    } finally {
      setInitialized(true);
      setLoadingState('initializing', false);
      initializeInFlightRef.current = false;
    }
  }, [setLoadingState, setSession, clearSession, setInitialized]);

  const signIn = useCallback(
    async (payload: SignInRequest) => {
      if (signInInFlightRef.current) {
        throw new Error('로그인 요청이 이미 진행 중입니다.');
      }

      signInInFlightRef.current = true;
      setLoadingState('signingIn', true);

      try {
        const response = await signInRequest(payload);

        if (!response) {
          throw new Error('로그인 응답이 없습니다.');
        }

        if (!response.user) {
          throw new Error('로그인 응답에 사용자 정보가 없습니다.');
        }

        const userModel = toUserModel(response.user);
        setSession(userModel);

        return response;
      } finally {
        setLoadingState('signingIn', false);
        signInInFlightRef.current = false;
      }
    },
    [setSession, setLoadingState],
  );

  const logout = useCallback(async () => {
    if (logoutInFlightRef.current) {
      return;
    }

    logoutInFlightRef.current = true;
    setLoadingState('loggingOut', true);

    try {
      await logoutRequest();
      clearSession();
    } finally {
      setLoadingState('loggingOut', false);
      logoutInFlightRef.current = false;
    }
  }, [clearSession, setLoadingState]);

  const isLoading = useMemo(() => {
    return loading.initializing || loading.signingIn || loading.loggingOut;
  }, [loading]);

  return useMemo(
    () => ({
      isLoading,
      isLoggedIn,
      isInitialized,
      user,
      loading,
      initializeSession,
      signIn,
      logout,
    }),
    [isLoading, isLoggedIn, isInitialized, user, loading, initializeSession, signIn, logout],
  );
}
