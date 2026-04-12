'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchGuestHome } from '../client/home.api';
import { mapHomeResponseToUi } from '../mapper';

export const useGuestHomeQuery = () => {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const isReady = useAuthStore((state) => state.isReady);
  const departmentType = useAuthStore((state) => state.user?.departmentType);

  const query = useQuery({
    queryKey: ['home-data', 'guest'],
    queryFn: fetchGuestHome,
    select: (data) => mapHomeResponseToUi(data),
    staleTime: 1000 * 60 * 5,
    enabled: isInitialized && isReady && !departmentType,
  });

  return {
    ...query,
    displayErrorMessage: query.error ? getErrorMessage('home', query.error) : null,
  };
};
