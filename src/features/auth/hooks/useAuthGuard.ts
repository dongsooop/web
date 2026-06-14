'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from './useAuth';

export function useAuthGuard(target = '/mypage') {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const isRedirecting = isReady && !isLoggedIn;

  useEffect(() => {
    if (!isRedirecting) {
      return;
    }

    router.replace(target);
  }, [isRedirecting, router, target]);

  return {
    isLoggedIn,
    isReady,
    isRedirecting,
  };
}
