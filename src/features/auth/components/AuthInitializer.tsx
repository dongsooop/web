'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export default function AuthInitializer() {
  const { initializeSession, isInitialized } = useAuth();
  const token = useAppCheckStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    if (!isInitialized) {
      void initializeSession();
    }
  }, [token, isInitialized, initializeSession]);

  return null;
}
