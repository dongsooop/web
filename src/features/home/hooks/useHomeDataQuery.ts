'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

import { useGuestHomeQuery } from './useGuestHomeQuery';
import { useHomeQuery } from './useHomeQuery';

export const useHomeDataQuery = () => {
  const { isLoggedIn } = useAuth();
  const homeQuery = useHomeQuery();
  const guestHomeQuery = useGuestHomeQuery();

  return isLoggedIn ? homeQuery : guestHomeQuery;
};
