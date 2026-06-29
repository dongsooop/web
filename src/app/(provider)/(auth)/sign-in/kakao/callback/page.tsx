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

const kakaoStateKey = 'kakao_signin_state';

function KakaoSignInCallbackContent() {
  const searchParams = useSearchParams();
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

      if (!code) {
        return 'SOCIAL_SDK';
      }

      if (!isSocialStateValid(state, savedState)) {
        return 'SOCIAL_STATE';
      }

      return null;
    },
    runAction: async ({ code }) => {
      await signInKakaoSocial(code);
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
