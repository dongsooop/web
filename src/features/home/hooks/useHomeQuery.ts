'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { fetcher } from '@/utils/request';

import { mapHomeResponseToUi } from '../mapper';

export const useHomeQuery = () => {
  const query = useQuery({
    queryKey: ['home-data'],
    queryFn: () => fetcher('/home'),
    select: (data) => mapHomeResponseToUi(data),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    displayErrorMessage: query.error ? getErrorMessage('home' as any, query.error) : null,
  };
};
