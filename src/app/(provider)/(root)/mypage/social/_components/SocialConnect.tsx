'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getSocialState } from '@/features/auth/client/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGoogleLink } from '@/features/auth/hooks/useGoogleLink';
import { useKakaoLink } from '@/features/auth/hooks/useKakaoLink';
import { useSocialError } from '@/features/auth/hooks/useSocialError';
import { buildSocialConnectItems } from '@/features/auth/social';
import type { LoginPlatform, SocialConnectItem } from '@/features/auth/types/ui-model';
import SocialLoginCard from './SocialLoginCard';

const defaultItems: SocialConnectItem[] = buildSocialConnectItems([]);
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
  const { isReady } = useAuth();
  const [items, setItems] = useState<SocialConnectItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingPlatform, setLoadingPlatform] = useState<LoginPlatform | null>(null);

  useSocialError((message) => {
    setErrorMessage(message);
  });

  const kakao = useKakaoLink({
    jsKey: kakaoJsKey,
    onError: setErrorMessage,
  });

  const refreshSocialState = async () => {
    const data = await getSocialState();
    setItems(buildSocialConnectItems(data.list));
  };

  const google = useGoogleLink({
    onLinked: async () => {
      await refreshSocialState();
      setErrorMessage(null);
    },
    onError: setErrorMessage,
    onFinish: () => {
      setLoadingPlatform(null);
    },
  });

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
    google.start();
  };

  const linkKakao = () => {
    if (loadingPlatform) {
      return;
    }

    setErrorMessage(null);
    setLoadingPlatform('kakao');

    const started = kakao.start();

    if (!started) {
      setLoadingPlatform(null);
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
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={kakao.init} />

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
              <p className="text-small text-warning px-1 pt-4 whitespace-pre-line">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
