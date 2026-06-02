'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useSocialError(setMessage: (message: string) => void, path = '/mypage/social') {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');

    if (!error) {
      return;
    }

    setMessage(error);
    router.replace(path, { scroll: false });
  }, [path, router, searchParams, setMessage]);
}
