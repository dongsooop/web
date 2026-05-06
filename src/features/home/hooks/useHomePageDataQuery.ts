'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { fetchCafeteria } from '@/features/cafeteria/client/cafeteria.api';
import { mapCafeteriaResponseToUi } from '@/features/cafeteria/mapper';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { getWeekKey } from '@/utils/date';

import { fetchGuestHome, fetchHome } from '../client/home.api';
import { mapHomeResponseToUi } from '../mapper';

export const useHomePageDataQuery = () => {
  const { isLoggedIn, isReady, user } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const weekKey = getWeekKey();
  const departmentType = user?.departmentType;

  const query = useQuery({
    queryKey: ['home-page-data', isLoggedIn ? 'auth' : 'guest', departmentType ?? 'guest', weekKey],
    queryFn: async () => {
      const [home, cafeteria] = await Promise.all([
        isLoggedIn && departmentType ? fetchHome() : fetchGuestHome(),
        fetchCafeteria(),
      ]);

      return {
        home: mapHomeResponseToUi(home),
        cafeteria: mapCafeteriaResponseToUi(cafeteria),
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    enabled: isInitialized && isReady && (!isLoggedIn || !!departmentType),
  });

  return {
    ...query,
    displayErrorMessage: query.error ? getErrorMessage('home', query.error) : null,
  };
};
