'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signInGoogleSocial } from '@/features/auth/client/auth.api';
import { toUserModel } from '@/features/auth/mapper';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

function getHashParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.hash.replace(/^#/, ''));
}

function resolveErrorMessage(error: string, description: string) {
  if (description) {
    return description;
  }

  if (error === 'access_denied') {
    return null;
  }

  return getErrorMessage('social', new Error(), 'sdk');
}

export default function GoogleSignInCallbackPage() {
  const router = useRouter();
  const token = useAppCheckStore((state) => state.token);
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const clearExpired = useAuthStore((state) => state.clearExpired);
  const [message, setMessage] = useState('보안 확인을 준비하는 중입니다.');

  useEffect(() => {
    let active = true;

    const finish = async () => {
      const params = getHashParams();
      const accessToken = params.get('access_token')?.trim() ?? '';
      const error = params.get('error')?.trim() ?? '';
      const errorDescription = params.get('error_description')?.trim() ?? '';

      if (error) {
        const nextMessage = resolveErrorMessage(error, errorDescription);

        if (!nextMessage) {
          router.replace('/sign-in', { scroll: false });
          return;
        }

        router.replace(`/sign-in?error=${encodeURIComponent(nextMessage)}`, { scroll: false });
        return;
      }

      if (!accessToken) {
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
        router.replace('/sign-in?error=' + encodeURIComponent(getErrorMessage('social', new Error(), 'sdk')), {
          scroll: false,
        });
        return;
      }

      try {
        if (active) {
          setMessage('구글 로그인 처리 중입니다.');
        }

        const result = await signInGoogleSocial(accessToken);

        if (!result?.user) {
          throw new Error(getErrorMessage('social', new Error(), 'login'));
        }

        setUser(toUserModel(result.user));
        clearExpired();
        router.replace('/', { scroll: false });
      } catch (error) {
        router.replace(`/sign-in?error=${encodeURIComponent(getErrorMessage('social', error, 'login'))}`, {
          scroll: false,
        });
      }
    };

    void finish();

    return () => {
      active = false;
    };
  }, [clearExpired, isInitialized, router, setUser, token]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] items-center justify-center px-6 text-center">
      <p className="text-body text-text-secondary">{message}</p>
    </div>
  );
}
