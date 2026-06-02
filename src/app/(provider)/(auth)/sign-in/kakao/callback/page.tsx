'use client';

import { useSearchParams } from 'next/navigation';

import { signInKakaoSocial } from '@/features/auth/client/auth.api';
import { SocialCallbackScreen } from '@/features/auth/components/SocialCallbackScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getKakaoCallbackResult } from '@/features/auth/lib/socialCallback';
import { clearSocialState, getSocialState, isSocialStateValid } from '@/features/auth/lib/socialState';
import { toUserModel } from '@/features/auth/mapper';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';

const kakaoStateKey = 'kakao_signin_state';

export default function KakaoSignInCallbackPage() {
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const clearExpired = useAuthStore((state) => state.clearExpired);
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
      const result = await signInKakaoSocial(code);

      if (!result?.user) {
        throw new Error(getErrorMessage('social', new Error(), 'login'));
      }

      setUser(toUserModel(result.user));
      clearExpired();
    },
    clearAction: () => {
      clearSocialState(kakaoStateKey);
    },
  });

  return <SocialCallbackScreen message={message} />;
}
