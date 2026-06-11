'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTimetable } from '../client/timetable.api';

export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTimetable(id),
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
