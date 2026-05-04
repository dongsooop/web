'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { linkKakaoSocial } from '@/features/auth/client/auth.api';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

const kakaoStateKey = 'kakao_oauth_state';

function resolveErrorMessage(error: string, description: string) {
  if (description) {
    return description;
  }

  if (error === 'access_denied') {
    return null;
  }

  return getErrorMessage('social', new Error(), 'sdk');
}

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAppCheckStore((state) => state.token);
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const [message, setMessage] = useState('보안 확인을 준비하는 중입니다.');

  useEffect(() => {
    let active = true;

    const finish = async () => {
      const code = searchParams.get('code')?.trim() ?? '';
      const state = searchParams.get('state')?.trim() ?? '';
      const error = searchParams.get('error')?.trim() ?? '';
      const errorDescription = searchParams.get('error_description')?.trim() ?? '';
      const savedState = sessionStorage.getItem(kakaoStateKey)?.trim() ?? '';

      if (error) {
        sessionStorage.removeItem(kakaoStateKey);
        const message = resolveErrorMessage(error, errorDescription);

        if (!message) {
          router.replace('/mypage/social', { scroll: false });
          return;
        }

        router.replace(
          `/mypage/social?error=${encodeURIComponent(message)}`,
          { scroll: false },
        );
        return;
      }

      if (!code || !state || !savedState || state !== savedState) {
        sessionStorage.removeItem(kakaoStateKey);
        router.replace(
          `/mypage/social?error=${encodeURIComponent(getErrorMessage('social', new Error(), 'sdk'))}`,
          { scroll: false },
        );
        return;
      }

      if (!isInitialized) {
        if (active) {
          setMessage('보안 확인을 준비하는 중입니다.');
        }

        return;
      }

      if (!token) {
        sessionStorage.removeItem(kakaoStateKey);
        router.replace(
          `/mypage/social?error=${encodeURIComponent('App Check 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.')}`,
          { scroll: false },
        );
        return;
      }

      try {
        if (active) {
          setMessage('카카오 계정 연동을 완료하는 중입니다.');
        }

        await linkKakaoSocial(code);
        sessionStorage.removeItem(kakaoStateKey);
        router.replace('/mypage/social', { scroll: false });
      } catch (error) {
        sessionStorage.removeItem(kakaoStateKey);
        const nextMessage = getErrorMessage('social', error, 'link');

        router.replace(`/mypage/social?error=${encodeURIComponent(nextMessage)}`, {
          scroll: false,
        });
      }
    };

    void finish();

    return () => {
      active = false;
    };
  }, [isInitialized, router, searchParams, token]);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[800px] items-center justify-center px-6 py-6 text-center lg:min-h-[calc(100dvh-3rem)]">
      <p className="text-body text-text-secondary">{message}</p>
    </div>
  );
}
