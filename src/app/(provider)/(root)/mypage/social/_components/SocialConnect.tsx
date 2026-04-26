'use client';

import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getSocialState, linkGoogleSocial } from '@/features/auth/client/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { buildSocialConnectItems } from '@/features/auth/social';
import type { SocialConnectItem } from '@/features/auth/types/ui-model';
import SocialLoginCard from './SocialLoginCard';

const defaultItems: SocialConnectItem[] = buildSocialConnectItems([]);

function SocialConnectSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-18 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function SocialConnect() {
  const { isReady } = useAuth();
  const [items, setItems] = useState<SocialConnectItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLinking, setIsGoogleLinking] = useState(false);

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
        setIsGoogleLinking(false);
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
        setIsGoogleLinking(false);
      }
    },
    onError: () => {
      setIsGoogleLinking(false);
      setErrorMessage('소셜 계정 연동 중 오류가 발생했습니다.');
    },
    onNonOAuthError: (error) => {
      setIsGoogleLinking(false);

      if (error.type === 'popup_closed') {
        return;
      }

      setErrorMessage('소셜 계정 연동 중 오류가 발생했습니다.');
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
        setErrorMessage(null);

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
    if (isGoogleLinking) {
      return;
    }

    setErrorMessage(null);
    setIsGoogleLinking(true);
    openGoogleLogin();
  };

  const clickGoogleLink = (item: SocialConnectItem) => {
    if (item.platform === 'google' && !item.isConnected) {
      linkGoogle();
    }
  };

  return (
    <div className="w-full">
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
                      onClick={() => clickGoogleLink(item)}
                      isLoading={item.platform === 'google' && isGoogleLinking}
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
