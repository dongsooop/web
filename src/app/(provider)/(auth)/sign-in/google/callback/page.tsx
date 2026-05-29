'use client';

import { signInGoogleSocial } from '@/features/auth/client/auth.api';
import { SocialCallbackScreen } from '@/features/auth/components/SocialCallbackScreen';
import { toUserModel } from '@/features/auth/mapper';
import { useSocialCallback } from '@/features/auth/hooks/useSocialCallback';
import { getGoogleCallbackResult } from '@/features/auth/lib/socialCallback';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';

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
    runAction: async (accessToken) => {
      const result = await signInGoogleSocial(accessToken);

      if (!result?.user) {
        throw new Error(getErrorMessage('social', new Error(), 'login'));
      }

      setUser(toUserModel(result.user));
      clearExpired();
    },
  });

  return <SocialCallbackScreen message={message} />;
}
