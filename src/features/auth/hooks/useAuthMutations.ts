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

export function useAuthMutations(
  saveSignedInUser: (user: UserResponse) => void,
  clearAuth: () => void,
  initSession: () => Promise<void>,
) {
  const setError = useAuthStore((state) => state.actions.setError);

  const signInMut = useMutation({
    mutationFn: async (payload: SignInRequest) => {
      const response = await signInRequest(payload);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      setError(null, null);
    },
    onError: (error) => setError(error, 'signIn'),
  });

  const signInGoogleMut = useMutation({
    mutationFn: async (token: string) => {
      const response = await signInGoogleSocialRequest(token);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      setError(null, null);
    },
    onError: (error) => setError(error, 'signInGoogle'),
  });

  const signInKakaoMut = useMutation({
    mutationFn: async (code: string) => {
      const response = await signInKakaoSocialRequest(code);
      if (!response?.user) throw new Error('NO_USER_INFO_IN_RESPONSE');
      return response;
    },
    onSuccess: (response) => {
      saveSignedInUser(response.user);
      setError(null, null);
    },
    onError: (error) => setError(error, 'signInKakao'),
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
