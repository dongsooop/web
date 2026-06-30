'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCafeteriaQuery } from '@/features/cafeteria/hooks/useCafeteriaQuery';
import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { toMonthKey } from '@/utils/date';

import { fetchGuestHome, fetchHome } from '../client/home.api';
import { mapHomeResponseToUi } from '../mapper';

export const useHomeData = () => {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const { isLoggedIn, isReady, user } = useAuth();
  const departmentType = user?.departmentType;
  const currentMonth = toMonthKey(new Date());

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
  const scheduleQuery = useScheduleQuery(currentMonth);

  return {
    home: homeQuery.data,
    cafeteria: cafeteriaQuery.data,
    isInitialLoading:
      homeQuery.isLoading || cafeteriaQuery.isLoading || scheduleQuery.isLoading,
    isHomeLoading: homeQuery.isLoading,
    isHomeError: homeQuery.isError,
    homeErrorMessage: homeQuery.error ? getErrorMessage('home', homeQuery.error) : null,
    isCafeteriaLoading: cafeteriaQuery.isLoading,
    isCafeteriaError: cafeteriaQuery.isError,
    cafeteriaErrorMessage: cafeteriaQuery.displayErrorMessage,
  };
};
