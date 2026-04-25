'use client';

import { useEffect, useState } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getSocialState } from '@/features/auth/client/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { buildSocialConnectItems } from '@/features/auth/social';
import type { SocialConnectItem } from '@/features/auth/types/ui-model';
import { useAppCheckStore } from '@/store/useAppCheckStore';
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
  const token = useAppCheckStore((state) => state.token);
  const isAppCheckReady = useAppCheckStore((state) => state.isInitialized);
  const [items, setItems] = useState<SocialConnectItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAppCheckReady || !isReady) {
      return;
    }

    if (!token) {
      setItems(buildSocialConnectItems([]));
      setErrorMessage('소셜 계정 연동 정보를 불러오는 중\n오류가 발생했습니다.');
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getSocialState();

        if (!active) {
          return;
        }

        setItems(buildSocialConnectItems(data.list));
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
  }, [isAppCheckReady, isReady, token]);

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
