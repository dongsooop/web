import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { TimetableCreateRequest, TimetableUpdateRequest } from '../types/request';
import type { TimetableResponse, TimetableSemester } from '../types/response';

export async function fetchTimetable(year: string, semester: TimetableSemester) {
  return clientRequestAuth<TimetableResponse>(
    `/bff/timetable/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`,
    {
      method: 'GET',
    },
  );
}

export async function createTimetable(payload: TimetableCreateRequest) {
  return clientRequestAuth<void>('/bff/timetable', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTimetable(payload: TimetableUpdateRequest) {
  return clientRequestAuth<void>('/bff/timetable', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
