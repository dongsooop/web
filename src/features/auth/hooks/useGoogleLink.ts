import { useGoogleLogin } from '@react-oauth/google';

type UseGoogleLinkOptions = {
  onToken: (token: string) => Promise<void>;
  onError: (message: string) => void;
  onFinish: () => void;
  cancelMessage?: string;
};

const googleScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

export function useGoogleLink({
  onToken,
  onError,
  onFinish,
  cancelMessage,
}: UseGoogleLinkOptions) {
  const open = useGoogleLogin({
    scope: googleScope,
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token?.trim();

      if (!token) {
        onError('구글 인증 토큰을 확인할 수 없습니다.');
        onFinish();
        return;
      }

      try {
        await onToken(token);
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
        if (cancelMessage) {
          onError(cancelMessage);
        }

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
