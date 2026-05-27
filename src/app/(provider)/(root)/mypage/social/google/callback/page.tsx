'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { linkGoogleSocial, unlinkSocial } from '@/features/auth/client/auth.api';
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

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAppCheckStore((state) => state.token);
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const [message, setMessage] = useState('보안 확인을 준비하는 중입니다.');

  useEffect(() => {
    let active = true;

    const finish = async () => {
      const mode = searchParams.get('mode')?.trim() === 'unlink' ? 'unlink' : 'link';
      const params = getHashParams();
      const accessToken = params.get('access_token')?.trim() ?? '';
      const error = params.get('error')?.trim() ?? '';
      const errorDescription = params.get('error_description')?.trim() ?? '';

      if (error) {
        const nextMessage = resolveErrorMessage(error, errorDescription);

        if (!nextMessage) {
          router.replace('/mypage/social', { scroll: false });
          return;
        }

        router.replace(`/mypage/social?error=${encodeURIComponent(nextMessage)}`, { scroll: false });
        return;
      }

      if (!accessToken) {
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
        router.replace(
          `/mypage/social?error=${encodeURIComponent('App Check 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.')}`,
          { scroll: false },
        );
        return;
      }

      try {
        if (active) {
          setMessage(
            mode === 'unlink' ? '구글 계정 연동을 해제하는 중입니다.' : '구글 계정 연동을 완료하는 중입니다.',
          );
        }

        if (mode === 'unlink') {
          await unlinkSocial('google', accessToken);
        } else {
          await linkGoogleSocial(accessToken);
        }

        router.replace('/mypage/social', { scroll: false });
      } catch (error) {
        router.replace(`/mypage/social?error=${encodeURIComponent(getErrorMessage('social', error, mode))}`, {
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
