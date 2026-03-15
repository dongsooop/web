'use client';

import { useEffect } from 'react';
import { initAppCheck, getAppCheckToken } from '@/lib/firebase';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const setToken = useAppCheckStore((state) => state.setToken);

  useEffect(() => {
    const setup = async () => {
      await initAppCheck();
      const token = await getAppCheckToken();
      setToken(token);
    };
    setup();
  }, [setToken]);

  return <>{children}</>;
}