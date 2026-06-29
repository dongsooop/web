import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';
import { useGoogleLink } from './useGoogleLink';
import { useKakaoLink } from './useKakaoLink';
import { useSocialError } from './useSocialError';
import { useDialogStore } from '@/store/useDialogStore';
import { getErrorMessage } from '@/lib/errors/messages';
import type { SocialErrorKey } from '@/features/auth/types/error';

type UseAuthSocialProps = {
  kakaoJsKey: string;
  signInGoogleSocial: (token: string) => Promise<unknown>;
  isSubmitting: boolean;
  isSigningGoogle: boolean;
  isSigningKakao: boolean;
};

export function useAuthSocial({
  kakaoJsKey,
  signInGoogleSocial,
  isSubmitting,
  isSigningGoogle,
  isSigningKakao,
}: UseAuthSocialProps) {
  const router = useRouter();
  const showDialog = useDialogStore((state) => state.showDialog);
  const setError = useAuthStore((state) => state.actions.setError);
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  useEffect(() => {
    const sdk = window.Kakao;
    if (!sdk || !kakaoJsKey) {
      setIsKakaoReady(false);
      return;
    }
    try {
      if (!sdk.isInitialized()) sdk.init(kakaoJsKey);
      setIsKakaoReady(true);
    } catch {
      setIsKakaoReady(false);
    }
  }, [kakaoJsKey]);

  const openSocialErrorDialog = (errorKey: SocialErrorKey) => {
    showDialog({
      title: '소셜 로그인 오류',
      content: getErrorMessage('social', errorKey),
      confirm: '확인',
      isSingleAction: true,
      color: 'danger',
      onConfirm: () => {},
    });
  };

  useSocialError((errorKey) => {
    openSocialErrorDialog(errorKey);
  }, '/sign-in');

  const kakao = useKakaoLink({
    context: 'login',
    jsKey: kakaoJsKey,
    stateKey: 'kakao_signin_state',
    stateType: 'signin',
    onError: openSocialErrorDialog,
    onFinish: () => {},
  });

  const google = useGoogleLink({
    onToken: async (token) => {
      await signInGoogleSocial(token);
      router.push('/');
    },
    onError: openSocialErrorDialog,
    onFinish: () => {},
    context: 'login',
    redirectPath: '/sign-in/google/callback',
    stateKey: 'google_signin_state',
    stateType: 'signin',
  });

  const socialLogin = (platform: 'kakao' | 'google') => {
    if (isSubmitting || isSigningGoogle || isSigningKakao) return;
    setError(null, null);

    if (platform === 'google') {
      google.start();
      return;
    }
    if (!isKakaoReady) {
      openSocialErrorDialog('SOCIAL_SDK');
      return;
    }
    kakao.start();
  };

  return {
    socialLogin,
    setIsKakaoReady,
    kakao,
  };
}
