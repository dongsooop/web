import { getErrorMessage } from '@/lib/errors/messages';

const kakaoStateKey = 'kakao_oauth_state';

type UseKakaoLinkOptions = {
  jsKey: string;
  onError: (message: string) => void;
  redirectUri?: string;
  stateKey?: string;
  stateType?: 'signin' | 'link';
};

function resolveRedirectUri(redirectUri?: string) {
  if (redirectUri?.trim()) {
    return redirectUri.trim();
  }

  if (typeof window === 'undefined') {
    return '';
  }

  return `${window.location.origin}/bff/auth/social/kakao/callback`;
}

function isRateLimit(error: unknown) {
  return (
    error instanceof Error &&
    /(too many requests|rate limit|429|too many)/i.test(error.message)
  );
}

export function useKakaoLink({
  jsKey,
  onError,
  redirectUri,
  stateKey = kakaoStateKey,
  stateType = 'link',
}: UseKakaoLinkOptions) {
  const ready = () => {
    const sdk = window.Kakao;

    if (!sdk || !jsKey) {
      return false;
    }

    if (!sdk.isInitialized()) {
      sdk.init(jsKey);
    }

    return true;
  };

  const init = () => {
    ready();
  };

  const start = () => {
    if (!ready() || !window.Kakao) {
      onError(getErrorMessage('social', new Error(), 'sdk'));
      return false;
    }

    const nextRedirectUri = resolveRedirectUri(redirectUri);

    if (!nextRedirectUri) {
      onError(getErrorMessage('social', new Error(), 'sdk'));
      return false;
    }

    try {
      const state = `${stateType}:${window.crypto.randomUUID()}`;
      sessionStorage.setItem(stateKey, state);

      window.Kakao.Auth.authorize({
        redirectUri: nextRedirectUri,
        state,
      });

      return true;
    } catch (error) {
      onError(
        isRateLimit(error)
          ? getErrorMessage('social', error, 'kakaoRateLimit')
          : getErrorMessage('social', error, 'sdk'),
      );
      return false;
    }
  };

  return {
    init,
    start,
  };
}
