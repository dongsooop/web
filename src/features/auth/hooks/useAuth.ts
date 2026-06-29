import { useCallback, useRef } from 'react';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useAuthMutations } from './useAuthMutations';
import { getSession } from '../client/auth.api';
import { toUserModel } from '../mapper';
import type { SignInRequest } from '../types/request';
import type { UserResponse } from '../types/response';

const AUTH_INIT_MIN_DELAY_MS = 300;

export function useAuth() {
  const initInFlightRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const isReady = useAuthStore((state) => state.isReady);
  const isExpired = useAuthStore((state) => state.isExpired);

  const setUser = useAuthStore((state) => state.actions.setUser);
  const clearAuth = useAuthStore((state) => state.actions.clearAuth);
  const setReady = useAuthStore((state) => state.actions.setReady);
  const expireSession = useAuthStore((state) => state.actions.expireSession);
  const clearExpired = useAuthStore((state) => state.actions.clearExpired);

  const saveSignedInUser = useCallback(
    (userResponse: UserResponse) => {
      setUser(toUserModel(userResponse));
      clearExpired();
    },
    [clearExpired, setUser],
  );

  const initSession = useCallback(async () => {
    if (initInFlightRef.current) return;
    initInFlightRef.current = true;
    const startTime = Date.now();

    try {
      const appCheckToken = useAppCheckStore.getState().token;
      if (!appCheckToken) return;

      const session = await getSession();
      if (session?.isLoggedIn && session.user) {
        saveSignedInUser(session.user);
        return;
      }
      clearAuth();
    } catch {
      clearAuth();
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingDelay = AUTH_INIT_MIN_DELAY_MS - elapsed;

      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }

      setReady();
      initInFlightRef.current = false;
    }
  }, [clearAuth, saveSignedInUser, setReady]);

  const mutations = useAuthMutations(saveSignedInUser, clearAuth, initSession);

  const signIn = useCallback(
    (payload: SignInRequest) => mutations.signIn.mutateAsync(payload),
    [mutations.signIn],
  );
  const signInGoogleSocial = useCallback(
    (token: string) => mutations.signInGoogle.mutateAsync(token),
    [mutations.signInGoogle],
  );
  const signInKakaoSocial = useCallback(
    (code: string) => mutations.signInKakao.mutateAsync(code),
    [mutations.signInKakao],
  );
  const logout = useCallback(() => mutations.logout.mutateAsync(), [mutations.logout]);
  const deleteAccount = useCallback(
    () => mutations.deleteAccount.mutateAsync(),
    [mutations.deleteAccount],
  );

  return {
    user,
    isLoggedIn: !!user,
    isReady,
    isExpired,
    isSubmitting: mutations.signIn.isPending,
    isSigningGoogle: mutations.signInGoogle.isPending,
    isSigningKakao: mutations.signInKakao.isPending,
    isLoggingOut: mutations.logout.isPending,
    isDeletingAccount: mutations.deleteAccount.isPending,
    initSession,
    signIn,
    signInGoogleSocial,
    signInKakaoSocial,
    logout,
    deleteAccount,
    expireSession,
    clearExpired,
  };
}
