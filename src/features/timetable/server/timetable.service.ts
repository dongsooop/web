import { fetchTimetableWithSpring } from './timetable.api';

import type { TimetableSemester } from '../types/response';

type FetchTimetableOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  year: string;
  semester: TimetableSemester;
};

export async function fetchTimetable(options: FetchTimetableOptions) {
  return fetchTimetableWithSpring(options.year, options.semester, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
