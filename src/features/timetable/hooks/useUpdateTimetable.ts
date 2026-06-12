'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTimetable } from '../client/timetable.api';
import type { TimetableUpdateRequest } from '../types/request';

export function useUpdateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TimetableUpdateRequest) => updateTimetable(payload),
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
