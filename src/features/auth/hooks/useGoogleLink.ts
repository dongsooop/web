import { useGoogleLogin, useGoogleOAuth } from '@react-oauth/google';
import { resolveSocialErrorKey } from '@/features/auth/lib/socialError';
import { setSocialState } from '../lib/socialState';
import type { SocialErrorContext, SocialErrorKey } from '@/features/auth/types/error';

type UseSocialStartOptions = {
  onError: (errorKey: SocialErrorKey) => void;
  onFinish: () => void;
};

type UseGoogleLinkOptions = UseSocialStartOptions & {
  onToken: (token: string) => Promise<void>;
  context: SocialErrorContext;
  redirectPath?: string;
  stateKey?: string;
  stateType?: 'signin' | 'link' | 'unlink';
};

const googleScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');
const googleStateKey = 'google_oauth_state';
const defaultWebOrigin = 'https://www.dongsoop.site';

function getWebOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return defaultWebOrigin;
}

function isMobileBrowser() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function buildRedirectUri(path?: string) {
  const origin = getWebOrigin();

  if (!path || !origin) {
    return undefined;
  }

  return new URL(path, origin).toString();
}

function buildAuthorizeUrl(clientId: string, redirectUri: string, state: string) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'token');
  url.searchParams.set('scope', googleScope);
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('state', state);

  return url.toString();
}

export function useGoogleLink({
  onToken,
  onError,
  onFinish,
  context,
  redirectPath,
  stateKey = googleStateKey,
  stateType = 'link',
}: UseGoogleLinkOptions) {
  const { clientId } = useGoogleOAuth();
  const redirectUri = buildRedirectUri(redirectPath);
  const init = () => {};

  const processSuccess = async (tokenResponse: { access_token?: string }) => {
    const token = tokenResponse.access_token?.trim();

    if (!token) {
      onError('SOCIAL_SDK');
      onFinish();
      return;
    }

    try {
      await onToken(token);
    } catch (error) {
      onError(resolveSocialErrorKey(error, context));
    } finally {
      onFinish();
    }
  };

  const handleSuccess = (tokenResponse: { access_token?: string }) => {
    void processSuccess(tokenResponse);
  };

  const handleError = () => {
    onFinish();
    onError('SOCIAL_SDK');
  };

  const handleNonOAuthError = (error: { type: string }) => {
    onFinish();

    if (error.type === 'popup_closed') {
      return;
    }

    onError('SOCIAL_SDK');
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
        onError('SOCIAL_SDK');
        onFinish();
        return;
      }

      const state = `${stateType}:${window.crypto.randomUUID()}`;
      setSocialState(stateKey, state);
      window.location.assign(buildAuthorizeUrl(clientId, redirectUri, state));
      return;
    }

    openPopup();
  };

  return {
    init,
    start,
  };
}
