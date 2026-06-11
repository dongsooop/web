'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTimetable } from '../client/timetable.api';
import type { TimetableCreateRequest } from '../types/request';

export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TimetableCreateRequest) => createTimetable(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['timetable-data'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['home-page-data'],
        }),
      ]);
    },
  });
}
