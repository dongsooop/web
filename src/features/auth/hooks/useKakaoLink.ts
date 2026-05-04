const kakaoStateKey = 'kakao_oauth_state';

type UseKakaoLinkOptions = {
  jsKey: string;
  onError: (message: string) => void;
};

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
      onError('카카오 로그인 설정을 확인해주세요.');
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
    } catch {
      onError('카카오 로그인 설정을 확인해주세요.');
      return false;
    }
  };

  return {
    init,
    start,
  };
}
