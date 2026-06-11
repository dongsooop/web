import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { TimetableResponse, TimetableSemester } from '../types/response';

export async function fetchTimetable(year: string, semester: TimetableSemester) {
  return clientRequestAuth<TimetableResponse>(
    `/bff/timetable/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`,
    {
      method: 'GET',
    },
  );
}
