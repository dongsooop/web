'use client';

import { useSearchParams } from 'next/navigation';

import { linkGoogleSocial, unlinkSocial } from '@/features/auth/client/auth.api';
import { SocialCallbackScreen } from '@/features/auth/components/SocialCallbackScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import { clearSocialState, getSocialState, isSocialStateValid } from '@/features/auth/lib/socialState';
import { getErrorMessage } from '@/lib/errors/messages';
import SocialPageLayout from '../../_components/SocialPageLayout';

const googleStateKey = 'google_oauth_state';

export default function GoogleCallbackPage() {
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
    appCheckErrorMessage: 'App Check 초기화에 실패했어요. 잠시 후 다시 시도해 주세요.',
    context: mode,
    validateAction: ({ accessToken, state }) => {
      const savedState = getSocialState(googleStateKey);

      if (!accessToken || !isSocialStateValid(state, savedState)) {
        return getErrorMessage('social', new Error(), 'sdk');
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
    <SocialPageLayout>
      <SocialCallbackScreen message={message} wide boxed />
    </SocialPageLayout>
  );
}
