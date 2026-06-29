import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import {
  deleteAccount as deleteRequest,
  logout as logoutRequest,
  signInGoogleSocial as signInGoogleSocialRequest,
  signInKakaoSocial as signInKakaoSocialRequest,
  signIn as signInRequest,
} from '../client/auth.api';
import type { SignInRequest } from '../types/request';
import type { UserResponse } from '../types/response';
import type { AuthErrorContext, AuthErrorKey } from '../types/error';

export function useAuthMutations(
  saveSignedInUser: (user: UserResponse) => void,
  clearAuth: () => void,
  initSession: () => Promise<void>,
) {
  const setError = useAuthStore((state) => state.actions.setError);
  const clearError = () => setError(null, null);
  const setAuthError = (error: unknown, context: AuthErrorContext) => {
    if (error instanceof Error && error.message === 'NO_USER_INFO_IN_RESPONSE') {
      setError(error.message as AuthErrorKey, context);
      return;
    }

    setError(error instanceof Error ? error : new Error('UNKNOWN_AUTH_ERROR'), context);
  };

  const signInMut = useMutation({
    mutationFn: async (payload: SignInRequest) => {
      const response = await signInRequest(payload);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      clearError();
    },
    onError: (error) => setAuthError(error, 'signIn'),
  });

  const signInGoogleMut = useMutation({
    mutationFn: async (token: string) => {
      const response = await signInGoogleSocialRequest(token);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      clearError();
    },
  });

  const signInKakaoMut = useMutation({
    mutationFn: async (code: string) => {
      const response = await signInKakaoSocialRequest(code);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      clearError();
    },
  });

  const logoutMut = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearAuth();
      void initSession();
    },
  });

  const deleteAccountMut = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      clearAuth();
      void initSession();
    },
  });

  return {
    signIn: signInMut,
    signInGoogle: signInGoogleMut,
    signInKakao: signInKakaoMut,
    logout: logoutMut,
    deleteAccount: deleteAccountMut,
  };
}
