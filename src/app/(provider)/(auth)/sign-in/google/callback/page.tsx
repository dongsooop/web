'use client';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import {
  clearSocialState,
  getSocialState,
  isSocialStateValid,
} from '@/features/auth/lib/socialState';
import { useAuth } from '@/features/auth/hooks/useAuth';

const googleStateKey = 'google_signin_state';

export default function GoogleSignInCallbackPage() {
  const { signInGoogleSocial } = useAuth();

  const message = useSocialCallback({
    result: getGoogleCallbackResult(),
    pendingMessage: '보안 확인 중이에요.',
    progressMessage: '구글 로그인 중이에요.',
    successPath: '/',
    errorPath: '/sign-in',
    cancelPath: '/sign-in',
    context: 'login',
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
      await signInGoogleSocial(accessToken);
    },
    clearAction: () => {
      clearSocialState(googleStateKey);
    },
  });

  return <LoadingScreen message={message} />;
}
