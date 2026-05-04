import { useGoogleLogin } from '@react-oauth/google';
import { getErrorMessage } from '@/lib/errors/messages';

type UseGoogleLinkOptions = {
  onToken: (token: string) => Promise<void>;
  onError: (message: string) => void;
  onFinish: () => void;
  context: 'link' | 'unlink';
};

const googleScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

export function useGoogleLink({
  onToken,
  onError,
  onFinish,
  context,
}: UseGoogleLinkOptions) {
  const open = useGoogleLogin({
    scope: googleScope,
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token?.trim();

      if (!token) {
        onError(getErrorMessage('social', new Error(), 'sdk'));
        onFinish();
        return;
      }

      try {
        await onToken(token);
      } catch (error) {
        onError(getErrorMessage('social', error, context));
      } finally {
        onFinish();
      }
    },
    onError: () => {
      onFinish();
      onError(getErrorMessage('social', new Error(), 'sdk'));
    },
    onNonOAuthError: (error) => {
      onFinish();

      if (error.type === 'popup_closed') {
        return;
      }

      onError(getErrorMessage('social', new Error(), 'sdk'));
    },
  });

  const start = () => {
    open();
  };

  return {
    start,
  };
}
