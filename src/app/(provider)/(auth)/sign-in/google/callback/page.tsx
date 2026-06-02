'use client';

import { signInGoogleSocial } from '@/features/auth/client/auth.api';
import { SocialCallbackScreen } from '@/features/auth/components/SocialCallbackScreen';
import { toUserModel } from '@/features/auth/mapper';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import { clearSocialState, getSocialState, isSocialStateValid } from '@/features/auth/lib/socialState';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';

const googleStateKey = 'google_signin_state';

export default function GoogleSignInCallbackPage() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearExpired = useAuthStore((state) => state.clearExpired);
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
      const result = await signInGoogleSocial(accessToken);

      if (!result?.user) {
        throw new Error(getErrorMessage('social', new Error(), 'login'));
      }

      setUser(toUserModel(result.user));
      clearExpired();
    },
    clearAction: () => {
      clearSocialState(googleStateKey);
    },
  });

  return <SocialCallbackScreen message={message} />;
}
