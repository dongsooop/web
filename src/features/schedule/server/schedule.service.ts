import type { ScheduleCreateRequest } from '../types/request';
import {
  createScheduleWithSpring,
  deleteScheduleWithSpring,
  fetchGuestScheduleWithSpring,
  fetchScheduleWithSpring,
  updateScheduleWithSpring,
} from './schedule.api';

type FetchScheduleOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  isAuthenticated: boolean;
  yearMonth: string;
};

export async function fetchSchedule(options: FetchScheduleOptions) {
  if (!options.isAuthenticated) {
    return {
      response: await fetchGuestScheduleWithSpring({
        appCheckToken: options.appCheckToken,
        yearMonth: options.yearMonth,
      }),
    };
  }

  return fetchScheduleWithSpring({
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
    yearMonth: options.yearMonth,
  });
}

type CreateScheduleOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  payload: ScheduleCreateRequest;
};

export async function createSchedule(options: CreateScheduleOptions) {
  return createScheduleWithSpring(options.payload, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

type UpdateScheduleOptions = CreateScheduleOptions & {
  id: number;
};

export async function updateSchedule(options: UpdateScheduleOptions) {
  return updateScheduleWithSpring(options.id, options.payload, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

type DeleteScheduleOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  id: number;
};

export async function deleteSchedule(options: DeleteScheduleOptions) {
  return deleteScheduleWithSpring(options.id, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
