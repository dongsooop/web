import { getErrorMessage } from '@/lib/errors/messages';

const kakaoStateKey = 'kakao_oauth_state';

type UseKakaoLinkOptions = {
  jsKey: string;
  onError: (message: string) => void;
};

function isRateLimit(error: unknown) {
  return (
    error instanceof Error &&
    /(too many requests|rate limit|429|too many)/i.test(error.message)
  );
}

export function useKakaoLink({ jsKey, onError }: UseKakaoLinkOptions) {
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

    try {
      const state = window.crypto.randomUUID();
      sessionStorage.setItem(kakaoStateKey, state);

      window.Kakao.Auth.authorize({
        redirectUri: `${window.location.origin}/bff/auth/social/kakao/callback`,
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
