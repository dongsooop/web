'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SocialErrorKey } from '@/features/auth/types/error';

export function useSocialError(setErrorKey: (errorKey: SocialErrorKey) => void, path = '/mypage/social') {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');

    if (!error) {
      handledErrorRef.current = null;
      return;
    }

    if (handledErrorRef.current === error) {
      return;
    }

    handledErrorRef.current = error;
    setErrorKey(error as SocialErrorKey);
    router.replace(path, { scroll: false });
  }, [path, router, searchParams, setErrorKey]);
}
