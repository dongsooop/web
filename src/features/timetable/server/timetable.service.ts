import {
  createTimetableWithSpring,
  fetchTimetableWithSpring,
  updateTimetableWithSpring,
} from './timetable.api';

import type { TimetableCreateRequest, TimetableUpdateRequest } from '../types/request';
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

type CreateTimetableOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  payload: TimetableCreateRequest;
};

export async function createTimetable(options: CreateTimetableOptions) {
  return createTimetableWithSpring(options.payload, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

type UpdateTimetableOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  payload: TimetableUpdateRequest;
};

export async function updateTimetable(options: UpdateTimetableOptions) {
  return updateTimetableWithSpring(options.payload, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
