'use client';

import { useGoogleLogin } from '@react-oauth/google';

import { linkGoogleSocial } from '@/features/auth/client/auth.api';

type UseGoogleLinkOptions = {
  onLinked: () => Promise<void>;
  onError: (message: string) => void;
  onFinish: () => void;
};

const googleScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

export function useGoogleLink({ onLinked, onError, onFinish }: UseGoogleLinkOptions) {
  const open = useGoogleLogin({
    scope: googleScope,
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token?.trim();

      if (!token) {
        onFinish();
        return;
      }

      try {
        await linkGoogleSocial(token);
        await onLinked();
      } catch (error) {
        onError(
          error instanceof Error && error.message
            ? error.message
            : '소셜 계정 연동 중 오류가 발생했습니다.',
        );
      } finally {
        onFinish();
      }
    },
    onError: () => {
      onFinish();
      onError('소셜 계정 연동 중 오류가 발생했습니다.');
    },
    onNonOAuthError: (error) => {
      onFinish();

      if (error.type === 'popup_closed') {
        return;
      }

      onError('소셜 계정 연동 중 오류가 발생했습니다.');
    },
  });

  const start = () => {
    open();
  };

  return {
    start,
  };
}
