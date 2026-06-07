'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleCreateRequest } from '../types/request';
import { createSchedule } from '../client/schedule.api';

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleCreateRequest) => createSchedule(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['schedule-data'],
      });
    },
  });
}
