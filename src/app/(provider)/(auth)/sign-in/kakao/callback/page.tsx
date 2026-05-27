'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { signInKakaoSocial } from '@/features/auth/client/auth.api';
import { toUserModel } from '@/features/auth/mapper';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

const kakaoStateKey = 'kakao_signin_state';

function resolveErrorMessage(error: string, description: string) {
  if (description) {
    return description;
  }

  if (error === 'access_denied') {
    return null;
  }

  return getErrorMessage('social', new Error(), 'sdk');
}

export default function KakaoSignInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAppCheckStore((state) => state.token);
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const clearExpired = useAuthStore((state) => state.clearExpired);
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
          router.replace('/sign-in', { scroll: false });
          return;
        }

        router.replace(`/sign-in?error=${encodeURIComponent(message)}`, { scroll: false });
        return;
      }

      if (!code || !state || !savedState || state !== savedState) {
        sessionStorage.removeItem(kakaoStateKey);
        router.replace(`/sign-in?error=${encodeURIComponent(getErrorMessage('social', new Error(), 'sdk'))}`, {
          scroll: false,
        });
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
        router.replace('/sign-in?error=' + encodeURIComponent(getErrorMessage('social', new Error(), 'sdk')), {
          scroll: false,
        });
        return;
      }

      try {
        if (active) {
          setMessage('카카오 로그인 처리 중입니다.');
        }

        const result = await signInKakaoSocial(code);

        if (!result?.user) {
          throw new Error(getErrorMessage('social', new Error(), 'login'));
        }

        setUser(toUserModel(result.user));
        clearExpired();
        sessionStorage.removeItem(kakaoStateKey);
        router.replace('/', { scroll: false });
      } catch (error) {
        sessionStorage.removeItem(kakaoStateKey);
        router.replace(`/sign-in?error=${encodeURIComponent(getErrorMessage('social', error, 'login'))}`, {
          scroll: false,
        });
      }
    };

    void finish();

    return () => {
      active = false;
    };
  }, [clearExpired, isInitialized, router, searchParams, setUser, token]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] items-center justify-center px-6 text-center">
      <p className="text-body text-text-secondary">{message}</p>
    </div>
  );
}
