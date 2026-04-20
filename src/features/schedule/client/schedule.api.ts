import { clientRequest } from '@/lib/api/clientRequest';
import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { ScheduleResponse } from '../types/response';

export async function fetchSchedule(month: string, isAuthenticated: boolean) {
  const url = `/bff/schedule/${encodeURIComponent(month)}`;
  const request = isAuthenticated ? clientRequestAuth<ScheduleResponse> : clientRequest<ScheduleResponse>;

  return request(url, {
    method: 'GET',
  });
}
