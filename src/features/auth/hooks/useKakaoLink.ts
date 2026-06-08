import { getErrorMessage } from '@/lib/errors/messages';
import { setSocialState } from '../lib/socialState';

const kakaoStateKey = 'kakao_oauth_state';
const defaultWebOrigin = 'https://www.dongsoop.site';

type UseSocialStartOptions = {
  onError: (message: string) => void;
  onFinish: () => void;
};

type UseKakaoLinkOptions = UseSocialStartOptions & {
  jsKey: string;
  redirectPath?: string;
  stateKey?: string;
  stateType?: 'signin' | 'link';
};

function getWebOrigin() {
  const site = process.env.NEXT_PUBLIC_WEB_SITE?.trim();

  if (site) {
    return site;
  }

  return defaultWebOrigin;
}

function resolveRedirectUri(path?: string) {
  const origin = getWebOrigin();

  if (!origin) {
    return '';
  }

  if (path?.trim()) {
    return new URL(path.trim(), origin).toString();
  }

  return new URL('/bff/auth/social/kakao/callback', origin).toString();
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
  onFinish,
  redirectPath,
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
    try {
      ready();
    } catch {
      // Ignore eager init errors here and let start() surface them consistently.
    }
  };

  const start = () => {
    try {
      if (!ready() || !window.Kakao) {
        onError(getErrorMessage('social', new Error(), 'sdk'));
        onFinish();
        return;
      }

      const nextRedirectUri = resolveRedirectUri(redirectPath);

      if (!nextRedirectUri) {
        onError(getErrorMessage('social', new Error(), 'sdk'));
        onFinish();
        return;
      }

      const state = `${stateType}:${window.crypto.randomUUID()}`;
      setSocialState(stateKey, state);

      window.Kakao.Auth.authorize({
        redirectUri: nextRedirectUri,
        state,
      });
    } catch (error) {
      onError(
        isRateLimit(error)
          ? getErrorMessage('social', error, 'kakaoRateLimit')
          : getErrorMessage('social', error, 'sdk'),
      );
      onFinish();
    }
  };

  return {
    init,
    start,
  };
}
