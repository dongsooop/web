import 'server-only';

import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { TimetableCreateRequest, TimetableUpdateRequest } from '../types/request';
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

export async function createTimetableWithSpring(
  payload: TimetableCreateRequest,
  options: TimetableRequestOptions,
) {
  const endpoint = getRequiredTimetableEndpoint();

  return serverFetchAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function updateTimetableWithSpring(
  payload: TimetableUpdateRequest,
  options: TimetableRequestOptions,
) {
  const endpoint = getRequiredTimetableEndpoint();

  return serverFetchAuth(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function deleteTimetableWithSpring(id: number, options: TimetableRequestOptions) {
  const endpoint = `${getRequiredTimetableEndpoint()}/${id}`;

  return serverFetchAuth(endpoint, {
    method: 'DELETE',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
