'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSchedule } from '../client/schedule.api';
import type { ScheduleCreateRequest } from '../types/request';

type UpdateScheduleInput = {
  id: number;
  payload: ScheduleCreateRequest;
};

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateScheduleInput) => updateSchedule(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['schedule-data'],
      });
    },
  });
}
