'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCafeteriaQuery } from '@/features/cafeteria/hooks/useCafeteriaQuery';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchGuestHome, fetchHome } from '../client/home.api';
import { mapHomeResponseToUi } from '../mapper';

export const useHomeData = () => {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const { isLoggedIn, isReady, user } = useAuth();
  const departmentType = user?.departmentType;

  const homeQuery = useQuery({
    queryKey: ['home-data', isLoggedIn ? 'auth' : 'guest', departmentType ?? 'guest'],
    queryFn: async () => {
      const response = isLoggedIn ? await fetchHome() : await fetchGuestHome();
      return mapHomeResponseToUi(response);
    },
    staleTime: 1000 * 60 * 5,
    enabled: isInitialized && isReady && (!isLoggedIn || !!departmentType),
  });
  const cafeteriaQuery = useCafeteriaQuery({
    enabled: !isLoggedIn || !!departmentType,
  });

  const data =
    homeQuery.data && cafeteriaQuery.data
      ? {
          home: homeQuery.data,
          cafeteria: cafeteriaQuery.data,
        }
      : undefined;

  return {
    data,
    isLoading: homeQuery.isLoading || cafeteriaQuery.isLoading,
    isError: homeQuery.isError || cafeteriaQuery.isError,
    displayErrorMessage:
      (homeQuery.error ? getErrorMessage('home', homeQuery.error) : null) ??
      cafeteriaQuery.displayErrorMessage,
    refetch: async () => {
      await Promise.all([homeQuery.refetch(), cafeteriaQuery.refetch()]);
    },
  };
};
