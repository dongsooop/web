import { clientRequest } from '@/lib/api/clientRequest';
import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { ScheduleCreateRequest } from '../types/request';
import type { ScheduleResponse } from '../types/response';

export async function fetchSchedule(month: string, isAuthenticated: boolean) {
  const url = `/bff/schedule/${encodeURIComponent(month)}`;
  const request = isAuthenticated ? clientRequestAuth<ScheduleResponse> : clientRequest<ScheduleResponse>;

  return request(url, {
    method: 'GET',
  });
}

export async function createSchedule(payload: ScheduleCreateRequest) {
  return clientRequestAuth<void>('/bff/schedule/write', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSchedule(id: number, payload: ScheduleCreateRequest) {
  return clientRequestAuth<void>(`/bff/schedule/write/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteSchedule(id: number) {
  return clientRequestAuth<void>(`/bff/schedule/write/${id}`, {
    method: 'DELETE',
  });
}
