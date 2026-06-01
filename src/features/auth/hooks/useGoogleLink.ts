import { useGoogleLogin, useGoogleOAuth } from '@react-oauth/google';
import { getErrorMessage } from '@/lib/errors/messages';

type UseSocialStartOptions = {
  onError: (message: string) => void;
  onFinish: () => void;
};

type UseGoogleLinkOptions = UseSocialStartOptions & {
  onToken: (token: string) => Promise<void>;
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

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function buildRedirectUri(path?: string) {
  if (!path || typeof window === 'undefined') {
    return undefined;
  }

  return new URL(path, window.location.origin).toString();
}

function buildAuthorizeUrl(clientId: string, redirectUri: string) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'token');
  url.searchParams.set('scope', googleScope);
  url.searchParams.set('include_granted_scopes', 'true');

  return url.toString();
}

export function useGoogleLink({
  onToken,
  onError,
  onFinish,
  context,
  redirectPath,
}: UseGoogleLinkOptions) {
  const { clientId } = useGoogleOAuth();
  const redirectUri = buildRedirectUri(redirectPath);
  const init = () => {};

  const processSuccess = async (tokenResponse: { access_token?: string }) => {
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

  const handleSuccess = (tokenResponse: { access_token?: string }) => {
    void processSuccess(tokenResponse);
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
    flow: 'implicit',
    scope: googleScope,
    onSuccess: handleSuccess,
    onError: handleError,
    onNonOAuthError: handleNonOAuthError,
  });

  const start = () => {
    if (isMobileBrowser() && redirectUri) {
      if (!clientId) {
        onError(getErrorMessage('social', new Error(), 'sdk'));
        onFinish();
        return;
      }

      window.location.assign(buildAuthorizeUrl(clientId, redirectUri));
      return;
    }

    openPopup();
  };

  return {
    init,
    start,
  };
}
