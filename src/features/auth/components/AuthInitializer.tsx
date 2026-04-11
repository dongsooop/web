'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export default function AuthInitializer() {
  const { initSession, isReady } = useAuth();
  const token = useAppCheckStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    if (!isReady) {
      void initSession();
    }
  }, [token, isReady, initSession]);

  return null;
}
