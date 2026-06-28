'use client';

import { useMemo } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import {
  clearSocialState,
  getSocialState,
  isSocialStateValid,
} from '@/features/auth/lib/socialState';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';

const googleStateKey = 'google_signin_state';

export default function GoogleSignInCallbackPage() {
  const setError = useAuthStore((state) => state.actions.setError);
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

      if (!accessToken || !isSocialStateValid(state, savedState)) {
        return getErrorMessage('social', new Error(), 'sdk');
      }

      return null;
    },
    runAction: async ({ accessToken }) => {
      try {
        await signInGoogleSocial(accessToken);
      } catch (error) {
        const errorMsg = getErrorMessage('social', error, 'login');
        setError(errorMsg, 'signInGoogle');
        throw new Error(errorMsg);
      }
    },
    clearAction: () => {
      clearSocialState(googleStateKey);
    },
  });

  return <LoadingScreen message={message} />;
}
