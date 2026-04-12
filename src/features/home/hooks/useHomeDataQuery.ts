'use client';

import { useAuthStore } from '@/features/auth/stores/useAuthStore';

import { useGuestHomeQuery } from './useGuestHomeQuery';
import { useHomeQuery } from './useHomeQuery';

export const useHomeDataQuery = () => {
  const departmentType = useAuthStore((state) => state.user?.departmentType);
  const homeQuery = useHomeQuery();
  const guestHomeQuery = useGuestHomeQuery();

  return departmentType ? homeQuery : guestHomeQuery;
};
