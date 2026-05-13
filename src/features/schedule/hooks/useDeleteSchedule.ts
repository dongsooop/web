'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteSchedule } from '../client/schedule.api';

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['schedule-data'],
      });
    },
  });
}
