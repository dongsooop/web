'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SocialErrorKey } from '@/features/auth/types/error';

export function useSocialError(setErrorKey: (errorKey: SocialErrorKey) => void, path = '/mypage/social') {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');

    if (!error) {
      return;
    }

    setErrorKey(error as SocialErrorKey);
    router.replace(path, { scroll: false });
  }, [path, router, searchParams, setErrorKey]);
}
