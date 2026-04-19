import { fetchGuestScheduleWithSpring, fetchScheduleWithSpring } from './schedule.api';

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
