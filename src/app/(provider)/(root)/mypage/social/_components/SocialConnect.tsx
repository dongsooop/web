'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useGoogleLogin } from '@react-oauth/google';

import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getSocialState, linkGoogleSocial } from '@/features/auth/client/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { buildSocialConnectItems } from '@/features/auth/social';
import type { LoginPlatform, SocialConnectItem } from '@/features/auth/types/ui-model';
import SocialLoginCard from './SocialLoginCard';

const defaultItems: SocialConnectItem[] = buildSocialConnectItems([]);
const kakaoStateKey = 'kakao_oauth_state';
const kakaoSdkUrl = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js';

function SocialConnectSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-18 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function SocialConnect({ kakaoJsKey }: { kakaoJsKey: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady } = useAuth();
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [items, setItems] = useState<SocialConnectItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingPlatform, setLoadingPlatform] = useState<LoginPlatform | null>(null);

  const initKakao = () => {
    const sdk = window.Kakao;

    if (!sdk || !kakaoJsKey) {
      return;
    }

    if (!sdk.isInitialized()) {
      sdk.init(kakaoJsKey);
    }

    setIsKakaoReady(true);
  };

  useEffect(() => {
    if (!window.Kakao || !kakaoJsKey) {
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoJsKey);
    }

    setIsKakaoReady(true);
  }, [kakaoJsKey]);

  const refreshSocialState = async () => {
    const data = await getSocialState();
    setItems(buildSocialConnectItems(data.list));
  };

  const openGoogleLogin = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    onSuccess: async (tokenResponse) => {
      const providerToken = tokenResponse.access_token?.trim();

      if (!providerToken) {
        setLoadingPlatform(null);
        return;
      }

      try {
        await linkGoogleSocial(providerToken);
        await refreshSocialState();
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : '소셜 계정 연동 중 오류가 발생했습니다.',
        );
      } finally {
        setLoadingPlatform(null);
      }
    },
    onError: () => {
      setLoadingPlatform(null);
      setErrorMessage('소셜 계정 연동 중 오류가 발생했습니다.');
    },
    onNonOAuthError: (error) => {
      setLoadingPlatform(null);

      if (error.type === 'popup_closed') {
        return;
      }

      setErrorMessage('소셜 계정 연동 중 오류가 발생했습니다.');
    },
  });

  useEffect(() => {
    const message = searchParams.get('error');

    if (message) {
      setErrorMessage(message);
      router.replace('/mypage/social', { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);

        if (!active) {
          return;
        }

        await refreshSocialState();
      } catch {
        if (!active) {
          return;
        }

        setItems(buildSocialConnectItems([]));
        setErrorMessage('소셜 계정 연동 정보를 불러오는 중\n오류가 발생했습니다.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [isReady]);

  const linkGoogle = () => {
    if (loadingPlatform) {
      return;
    }

    setErrorMessage(null);
    setLoadingPlatform('google');
    openGoogleLogin();
  };

  const linkKakao = () => {
    if (loadingPlatform) {
      return;
    }

    if (!isKakaoReady || !window.Kakao) {
      setErrorMessage('카카오 로그인 설정을 확인해주세요.');
      return;
    }

    setErrorMessage(null);
    setLoadingPlatform('kakao');

    try {
      const state = window.crypto.randomUUID();
      sessionStorage.setItem(kakaoStateKey, state);

      window.Kakao.Auth.authorize({
        redirectUri: `${window.location.origin}/bff/auth/social/kakao/callback`,
        state,
      });
    } catch {
      setLoadingPlatform(null);
      setErrorMessage('카카오 로그인 설정을 확인해주세요.');
    }
  };

  const clickLink = (item: SocialConnectItem) => {
    if (item.isConnected) {
      return;
    }

    if (item.platform === 'google') {
      linkGoogle();
      return;
    }

    if (item.platform === 'kakao') {
      linkKakao();
    }
  };

  return (
    <div className="w-full">
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={initKakao} />

      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
        <PageHeader
          title="소셜 계정 연동"
          description="연결된 계정을 확인하고 로그인 연동 상태를 관리할 수 있어요."
        />

        <div className="mx-auto w-full py-3">
          <div className="w-full rounded-[8px] bg-white p-4">
            {isLoading ? (
              <SocialConnectSkeleton />
            ) : (
              <div>
                {items.map((item) => (
                  <div key={item.platform}>
                    <SocialLoginCard
                      platform={item.platform}
                      isConnected={item.isConnected}
                      date={item.date}
                      onClick={() => clickLink(item)}
                      isLoading={item.platform === loadingPlatform}
                    />
                  </div>
                ))}
              </div>
            )}

            {errorMessage && (
              <p className="text-small text-warning whitespace-pre-line px-1 pt-4">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
