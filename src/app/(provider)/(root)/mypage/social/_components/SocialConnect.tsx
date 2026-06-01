'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { CheckCircle2, CircleAlert } from 'lucide-react';

import { Skeleton } from '@/components/ui/Skeleton';
import { getSocialState, linkGoogleSocial, unlinkSocial } from '@/features/auth/client/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGoogleLink } from '@/features/auth/hooks/useGoogleLink';
import { useKakaoLink } from '@/features/auth/hooks/useKakaoLink';
import { useSocialError } from '@/features/auth/hooks/useSocialError';
import { buildSocialConnectItems } from '@/features/auth/social';
import type { LoginPlatform, SocialConnectItem } from '@/features/auth/types/ui-model';
import { getErrorMessage } from '@/lib/errors/messages';
import SocialLoginCard from './SocialLoginCard';

const defaultItems: SocialConnectItem[] = buildSocialConnectItems([]);
const kakaoSdkUrl = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js';

type ActionMessage = {
  tone: 'success' | 'error';
  message: string;
};

function SocialConnectSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-18 w-full rounded-lg" />
      ))}
    </div>
  );
}

function getListErrorMessage(error: unknown) {
  return getErrorMessage('social', error, 'state');
}

export default function SocialConnect({ kakaoJsKey }: { kakaoJsKey: string }) {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const [items, setItems] = useState<SocialConnectItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);
  const [listErrorMessage, setListErrorMessage] = useState<string | null>(null);
  const [loadingPlatform, setLoadingPlatform] = useState<LoginPlatform | null>(null);
  const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null);

  useSocialError((message) => {
    setActionMessage({ tone: 'error', message });
  });

  const stopLoading = () => {
    setLoadingPlatform(null);
  };

  const kakao = useKakaoLink({
    jsKey: kakaoJsKey,
    onError: (message) => {
      setActionMessage({ tone: 'error', message });
    },
    onFinish: stopLoading,
  });

  const refreshSocialState = async () => {
    const data = await getSocialState();
    setItems(buildSocialConnectItems(data.list));
    setListErrorMessage(null);
  };

  const showActionMessage = (tone: ActionMessage['tone'], message: string) => {
    setActionMessage({ tone, message });
  };

  const startLoading = (platform: LoginPlatform) => {
    if (loadingPlatform) {
      return false;
    }

    setActionMessage(null);
    setLoadingPlatform(platform);
    return true;
  };

  const applyUnlink = (platform: LoginPlatform) => {
    setItems((prev) =>
      prev.map((item) =>
        item.platform === platform ? { ...item, isConnected: false, date: null } : item,
      ),
    );
  };

  const google = useGoogleLink({
    onToken: async (token) => {
      await linkGoogleSocial(token);
      await refreshSocialState();
    },
    onError: (message) => {
      setActionMessage({ tone: 'error', message });
    },
    onFinish: stopLoading,
    context: 'link',
    redirectPath: '/mypage/social/google/callback?mode=link',
  });

  const googleUnlink = useGoogleLink({
    onToken: async (token) => {
      await unlinkSocial('google', token);
      applyUnlink('google');
      showActionMessage('success', '구글 계정 연결이 해제되었어요.');
    },
    onError: (message) => {
      setActionMessage({ tone: 'error', message });
    },
    onFinish: stopLoading,
    context: 'unlink',
    redirectPath: '/mypage/social/google/callback?mode=unlink',
  });

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isLoggedIn) {
      router.replace('/mypage');
    }
  }, [isLoggedIn, isReady, router]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isLoggedIn) {
      setItems(defaultItems);
      setListErrorMessage(null);
      setActionMessage(null);
      setIsLoading(false);
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
      } catch (error) {
        if (!active) {
          return;
        }

        setListErrorMessage(getListErrorMessage(error));
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
  }, [isLoggedIn, isReady]);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActionMessage(null);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [actionMessage]);

  const linkGoogle = () => {
    if (!startLoading('google')) {
      return;
    }

    google.start();
  };

  const linkKakao = () => {
    if (!startLoading('kakao')) {
      return;
    }

    kakao.start();
  };

  const unlinkKakao = async () => {
    await unlinkSocial('kakao');
    applyUnlink('kakao');
    showActionMessage('success', '카카오 계정 연결이 해제되었어요.');
  };

  const unlinkItem = async (item: SocialConnectItem) => {
    if (!startLoading(item.platform)) {
      return;
    }

    try {
      if (item.platform === 'google') {
        googleUnlink.start();
        return;
      }

      await unlinkKakao();
    } catch (error) {
      showActionMessage('error', getErrorMessage('social', error, 'unlink'));
    } finally {
      if (item.platform !== 'google') {
        stopLoading();
      }
    }
  };

  const clickItem = (item: SocialConnectItem) => {
    if (item.isConnected) {
      void unlinkItem(item);
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

  if (isReady && !isLoggedIn) {
    return null;
  }

  return (
    <>
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={kakao.init} />
      <div className="min-h-[188px]">
        {isLoading ? (
          <SocialConnectSkeleton />
        ) : listErrorMessage ? (
          <div className="flex h-[236px] items-center justify-center px-4 text-center">
            <div className="flex flex-col items-center">
              <CircleAlert className="text-warning mb-4 h-12 w-12 shrink-0" />
              <p className="text-normal text-gray6 whitespace-pre-line">{listErrorMessage}</p>
            </div>
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.platform}>
                <SocialLoginCard
                  platform={item.platform}
                  isConnected={item.isConnected}
                  date={item.date}
                  onClick={() => clickItem(item)}
                  isLoading={item.platform === loadingPlatform}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {!listErrorMessage && (
        <div className="my-2 min-h-[48px]">
          {actionMessage ? (
            <div
              className={`animate-in fade-in slide-in-from-bottom-2 flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-black shadow-[0_12px_32px_rgba(15,23,42,0.12)] duration-200 ${
                actionMessage.tone === 'success' ? 'border-primary/15' : 'border-warning/20'
              }`}
            >
              {actionMessage.tone === 'success' ? (
                <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
              ) : (
                <CircleAlert className="text-warning h-5 w-5 shrink-0" />
              )}
              <p className="text-normal min-w-0 flex-1 font-medium whitespace-pre-line">
                {actionMessage.message}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
