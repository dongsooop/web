import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { useAuthStore } from '../stores/useAuthStore';
import { useGoogleLink } from './useGoogleLink';
import { useKakaoLink } from './useKakaoLink';
import { useSocialError } from './useSocialError';
import { useDialogStore } from '@/store/useDialogStore';

type UseAuthSocialProps = {
  kakaoJsKey: string;
};

export function useAuthSocial({ kakaoJsKey }: UseAuthSocialProps) {
  const router = useRouter();
  const showDialog = useDialogStore((state) => state.showDialog);
  const setError = useAuthStore((state) => state.actions.setError);
  const { signInGoogleSocial, isSubmitting, isSigningGoogle, isSigningKakao } = useAuth();
  
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

  const openSocialErrorDialog = (message: string) => {
    showDialog({
      title: '소셜 로그인 오류',
      content: message,
      confirm: '확인',
      isSingleAction: true,
      color: 'danger',
      onConfirm: () => {},
    });
  };

  useSocialError((message) => {
    openSocialErrorDialog(message);
  }, '/sign-in');

  const kakao = useKakaoLink({
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
      openSocialErrorDialog('카카오 로그인 준비 중이에요. 잠시 후 다시 시도해주세요.');
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
