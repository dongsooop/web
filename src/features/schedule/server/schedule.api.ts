import 'server-only';

import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { ScheduleCreateRequest } from '../types/request';

type ScheduleSpringRequestOptions = {
  appCheckToken?: string;
};

type ScheduleSpringAuthRequestOptions = ScheduleSpringRequestOptions & {
  accessToken?: string;
  refreshToken?: string;
};

function getRequiredScheduleEndpoint() {
  const endpoint = process.env.CALENDAR_ENDPOINT;

  if (!endpoint) {
    throw new Error('CALENDAR_ENDPOINT_MISSING');
  }

  return endpoint;
}

function getRequiredScheduleWriteEndpoint() {
  const endpoint = process.env.CALENDAR_WRITE_ENDPOINT;

  if (!endpoint) {
    throw new Error('CALENDAR_WRITE_ENDPOINT_MISSING');
  }

  return endpoint;
}

function buildScheduleUrl(yearMonth: string) {
  const endpoint = getRequiredScheduleEndpoint();
  return `${endpoint}/${encodeURIComponent(yearMonth)}`;
}

export async function fetchGuestScheduleWithSpring(
  options: ScheduleSpringRequestOptions & {
    yearMonth: string;
  },
) {
  return serverFetch(buildScheduleUrl(options.yearMonth), {
    method: 'GET',
    appCheckToken: options.appCheckToken,
  });
}

export async function fetchScheduleWithSpring(
  options: ScheduleSpringAuthRequestOptions & {
    yearMonth: string;
  },
) {
  return serverFetchAuth(buildScheduleUrl(options.yearMonth), {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function createScheduleWithSpring(
  payload: ScheduleCreateRequest,
  options: ScheduleSpringAuthRequestOptions,
) {
  const endpoint = getRequiredScheduleWriteEndpoint();

  return serverFetchAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
