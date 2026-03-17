'use client';

import { useEffect } from 'react';
import { initAppCheck, getAppCheckToken } from '@/lib/firebase';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const setToken = useAppCheckStore((state) => state.setToken);
  const setInitialized = useAppCheckStore((state) => state.setInitialized);

  useEffect(() => {
    const setup = async () => {
      try {
        await initAppCheck();
        const token = await getAppCheckToken();
        if (!token) throw new Error('Token missing');
        setToken(token);
      } catch {
        setToken(null);
      } finally {
        setInitialized(true);
      }
    };
    setup();
  }, [setToken, setInitialized]);

  return <>{children}</>;
}
