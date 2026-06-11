import 'server-only';

import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { TimetableSemester } from '../types/response';

type TimetableRequestOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
};

function getRequiredTimetableEndpoint() {
  const endpoint = process.env.TIMETABLE_ENDPOINT;

  if (!endpoint) {
    throw new Error('TIMETABLE_ENDPOINT_MISSING');
  }

  return endpoint;
}

function buildTimetableUrl(year: string, semester: TimetableSemester) {
  const endpoint = getRequiredTimetableEndpoint();

  return `${endpoint}/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`;
}

export async function fetchTimetableWithSpring(
  year: string,
  semester: TimetableSemester,
  options: TimetableRequestOptions,
) {
  return serverFetchAuth(buildTimetableUrl(year, semester), {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
