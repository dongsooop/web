'use client';

import { useQuery } from '@tanstack/react-query';
import { errorMessage } from '@/lib/errors/messages';
import { mapHomeResponseToUi } from '../mapper';
import { fetcher } from '@/utils/request';

export const useHomeQuery = () => {
  const query = useQuery({
    queryKey: ['home-data'],
    queryFn: () => fetcher('/home'),
    select: (data) => mapHomeResponseToUi(data),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    displayErrorMessage: query.error ? errorMessage('home' as any, query.error) : null,
  };
};
