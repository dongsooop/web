'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { linkGoogleSocial, unlinkSocial } from '@/features/auth/client/auth.api';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import { clearSocialState, getSocialState, isSocialStateValid } from '@/features/auth/lib/socialState';
import SocialConnectLayout from '../../_components/SocialConnectLayout';

const googleStateKey = 'google_oauth_state';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode')?.trim() === 'unlink' ? 'unlink' : 'link';
  const message = useSocialCallback({
    result: getGoogleCallbackResult(),
    pendingMessage: '보안 확인 중이에요.',
    progressMessage:
      mode === 'unlink' ? '구글 계정 연결을 해제하고 있어요.' : '구글 계정을 연결하고 있어요.',
    successPath: '/mypage/social',
    errorPath: '/mypage/social',
    cancelPath: '/mypage/social',
    appCheckErrorKey: 'SOCIAL_SDK',
    context: mode,
    validateAction: ({ accessToken, state }) => {
      const savedState = getSocialState(googleStateKey);

      if (!accessToken) {
        return 'SOCIAL_SDK';
      }

      if (!isSocialStateValid(state, savedState)) {
        return 'SOCIAL_STATE';
      }

      return null;
    },
    runAction: async ({ accessToken }) => {
      if (mode === 'unlink') {
        await unlinkSocial('google', accessToken);
        return;
      }

      await linkGoogleSocial(accessToken);
    },
    clearAction: () => {
      clearSocialState(googleStateKey);
    },
  });

  return (
    <SocialConnectLayout>
      <LoadingScreen message={message} wide boxed />
    </SocialConnectLayout>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <SocialConnectLayout>
          <LoadingScreen message="보안 확인 중이에요." wide boxed />
        </SocialConnectLayout>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
