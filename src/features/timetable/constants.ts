import type { TimetableWeekKey } from './types/response';

export const DEFAULT_TIMETABLE_YEAR = '2026';
export const DEFAULT_TIMETABLE_SEMESTER = 'FIRST';

export const TIMETABLE_SEMESTER_LABEL = {
  FIRST: '1학기',
  SECOND: '2학기',
  SUMMER: '여름학기',
  WINTER: '겨울학기',
} as const;

export const TIMETABLE_REQUEST_WEEK: Record<TimetableWeekKey, TimetableWeekKey> = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};
