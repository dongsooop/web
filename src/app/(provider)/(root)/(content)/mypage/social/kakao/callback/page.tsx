'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { linkKakaoSocial } from '@/features/auth/client/auth.api';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getKakaoCallbackResult } from '@/features/auth/lib/socialCallback';
import {
  clearSocialState,
  getSocialState,
  isSocialStateValid,
} from '@/features/auth/lib/socialState';
import { getErrorMessage } from '@/lib/errors/messages';
import SocialPageLayout from '../../_components/SocialPageLayout';

const kakaoStateKey = 'kakao_oauth_state';

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const message = useSocialCallback({
    result: getKakaoCallbackResult(searchParams),
    pendingMessage: '보안 확인 중이에요.',
    progressMessage: '카카오 계정을 연결하고 있어요.',
    successPath: '/mypage/social',
    errorPath: '/mypage/social',
    cancelPath: '/mypage/social',
    appCheckErrorMessage: 'App Check 초기화에 실패했어요. 잠시 후 다시 시도해 주세요.',
    context: 'link',
    validateAction: ({ code, state }) => {
      const savedState = getSocialState(kakaoStateKey);

      if (!code || !isSocialStateValid(state, savedState)) {
        return getErrorMessage('social', new Error(), 'sdk');
      }

      return null;
    },
    runAction: async ({ code }) => {
      await linkKakaoSocial(code);
    },
    clearAction: () => {
      clearSocialState(kakaoStateKey);
    },
  });

  return (
    <SocialPageLayout>
      <LoadingScreen message={message} wide boxed />
    </SocialPageLayout>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <SocialPageLayout>
          <LoadingScreen message="보안 확인 중이에요." wide boxed />
        </SocialPageLayout>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
