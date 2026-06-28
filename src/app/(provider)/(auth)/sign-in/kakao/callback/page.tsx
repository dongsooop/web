'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getKakaoCallbackResult } from '@/features/auth/lib/socialCallback';
import {
  clearSocialState,
  getSocialState,
  isSocialStateValid,
} from '@/features/auth/lib/socialState';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';

const kakaoStateKey = 'kakao_signin_state';

function KakaoSignInCallbackContent() {
  const searchParams = useSearchParams();
  const setError = useAuthStore((state) => state.actions.setError);
  const { signInKakaoSocial } = useAuth();

  const message = useSocialCallback({
    result: getKakaoCallbackResult(searchParams),
    pendingMessage: '보안 확인 중이에요.',
    progressMessage: '카카오 로그인 중이에요.',
    successPath: '/',
    errorPath: '/sign-in',
    cancelPath: '/sign-in',
    context: 'login',
    validateAction: ({ code, state }) => {
      const savedState = getSocialState(kakaoStateKey);

      if (!code || !isSocialStateValid(state, savedState)) {
        return getErrorMessage('social', new Error(), 'sdk');
      }

      return null;
    },
    runAction: async ({ code }) => {
      try {
        await signInKakaoSocial(code);
      } catch (error) {
        const errorMsg = getErrorMessage('social', error, 'login');
        setError(errorMsg, 'signInKakao');
        throw new Error(errorMsg);
      }
    },
    clearAction: () => {
      clearSocialState(kakaoStateKey);
    },
  });

  return <LoadingScreen message={message} />;
}

export default function KakaoSignInCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen message="보안 확인 중이에요." />}>
      <KakaoSignInCallbackContent />
    </Suspense>
  );
}
