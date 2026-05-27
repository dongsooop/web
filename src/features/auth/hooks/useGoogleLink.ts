import { useGoogleLogin } from '@react-oauth/google';
import { getErrorMessage } from '@/lib/errors/messages';

type UseGoogleLinkOptions = {
  onToken: (token: string) => Promise<void>;
  onError: (message: string) => void;
  onFinish: () => void;
  context: 'login' | 'link' | 'unlink';
  redirectPath?: string;
};

const googleScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

function isMobileBrowser() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function buildRedirectUri(path?: string) {
  if (!path || typeof window === 'undefined') {
    return undefined;
  }

  return new URL(path, window.location.origin).toString();
}

export function useGoogleLink({
  onToken,
  onError,
  onFinish,
  context,
  redirectPath,
}: UseGoogleLinkOptions) {
  const redirectUri = buildRedirectUri(redirectPath);

  const handleSuccess = async (tokenResponse: { access_token?: string }) => {
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
  };

  const handleError = () => {
    onFinish();
    onError(getErrorMessage('social', new Error(), 'sdk'));
  };

  const handleNonOAuthError = (error: { type: string }) => {
    onFinish();

    if (error.type === 'popup_closed') {
      return;
    }

    onError(getErrorMessage('social', new Error(), 'sdk'));
  };

  const openPopup = useGoogleLogin({
    scope: googleScope,
    onSuccess: handleSuccess,
    onError: handleError,
    onNonOAuthError: handleNonOAuthError,
  });

  const openRedirect = useGoogleLogin({
    scope: googleScope,
    ux_mode: 'redirect',
    redirect_uri: redirectUri,
    onSuccess: handleSuccess,
    onError: handleError,
    onNonOAuthError: handleNonOAuthError,
  });

  const start = () => {
    if (isMobileBrowser() && redirectUri) {
      openRedirect();
      return;
    }

    openPopup();
  };

  return {
    start,
  };
}
