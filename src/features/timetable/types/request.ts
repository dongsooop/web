import type { TimetableSemester, TimetableWeekKey } from './response';

export type TimetableCreateRequest = {
  name: string;
  professor: string;
  location: string;
  week: TimetableWeekKey;
  startAt: string;
  endAt: string;
  year: number;
  semester: TimetableSemester;
};

export type TimetableUpdateRequest = TimetableCreateRequest & {
  id: number;
};
