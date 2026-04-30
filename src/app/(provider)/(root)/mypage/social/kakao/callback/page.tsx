'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { linkKakaoSocial } from '@/features/auth/client/auth.api';
import { useAppCheckStore } from '@/store/useAppCheckStore';

const kakaoStateKey = 'kakao_oauth_state';

function resolveErrorMessage(error: string, description: string) {
  if (description) {
    return description;
  }

  if (error === 'access_denied') {
    return '카카오 로그인이 취소되었습니다.';
  }

  return '카카오 인증 정보를 확인할 수 없습니다.';
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
        router.replace(
          `/mypage/social?error=${encodeURIComponent(resolveErrorMessage(error, errorDescription))}`,
          { scroll: false },
        );
        return;
      }

      if (!code || !state || !savedState || state !== savedState) {
        sessionStorage.removeItem(kakaoStateKey);
        router.replace(
          `/mypage/social?error=${encodeURIComponent('카카오 인증 정보를 확인할 수 없습니다.')}`,
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
        const nextMessage =
          error instanceof Error && error.message
            ? error.message
            : '소셜 계정 연동 중 오류가 발생했습니다.';

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
