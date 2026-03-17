'use client';

import { useQuery } from '@tanstack/react-query';
import { errorMessage } from '@/lib/errors/messages';
import { mapHomeResponseToUi } from '../mapper';
import { getHomeData } from '@/app/api/home/service';

export const useHomeQuery = () => {
  const query = useQuery({
    queryKey: ['home-data'],
    queryFn: getHomeData,
    select: (data) => mapHomeResponseToUi(data),
  });

  return {
    ...query,
    displayErrorMessage: query.error ? errorMessage('home', query.error) : null,
  };
};
