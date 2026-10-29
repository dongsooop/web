import { resolveSocialErrorKey } from '@/features/auth/lib/socialError';
import { setSocialState } from '../lib/socialState';
import type { SocialErrorContext, SocialErrorKey } from '@/features/auth/types/error';

const kakaoStateKey = 'kakao_oauth_state';
const defaultWebOrigin = 'https://www.dongsoop.site';

type UseSocialStartOptions = {
  onError: (errorKey: SocialErrorKey) => void;
  onFinish: () => void;
};

type UseKakaoLinkOptions = UseSocialStartOptions & {
  context: SocialErrorContext;
  jsKey: string;
  redirectPath?: string;
  stateKey?: string;
  stateType?: 'signin' | 'link';
};

function getWebOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
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
  context,
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
        onError('SOCIAL_SDK');
        onFinish();
        return;
      }

      const nextRedirectUri = resolveRedirectUri(redirectPath);

      if (!nextRedirectUri) {
        onError('SOCIAL_SDK');
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
      onError(isRateLimit(error) ? 'SOCIAL_KAKAO_RATE_LIMIT' : resolveSocialErrorKey(error, context));
      onFinish();
    }
  };

  return {
    init,
    start,
  };
}
