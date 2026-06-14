import type { TimetableSemester, TimetableWeekKey } from './types/response';

export const TIMETABLE_WEEKDAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
] as const satisfies readonly TimetableWeekKey[];

export const TIMETABLE_WEEKDAY_LABELS = [
  { key: 'MONDAY', label: '월' },
  { key: 'TUESDAY', label: '화' },
  { key: 'WEDNESDAY', label: '수' },
  { key: 'THURSDAY', label: '목' },
  { key: 'FRIDAY', label: '금' },
] as const satisfies readonly { key: TimetableWeekKey; label: string }[];

export const TIMETABLE_SEMESTER_LABEL = {
  FIRST: '1학기',
  SECOND: '2학기',
  SUMMER: '여름학기',
  WINTER: '겨울학기',
} as const;

export function getCurrentTimetableSemester(date = new Date()): TimetableSemester {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 6) return 'FIRST';
  if (month >= 7 && month <= 8) return 'SUMMER';
  if (month >= 9 && month <= 12) return 'SECOND';
  return 'WINTER';
}

export function getCurrentTimetableYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month <= 2) {
    return String(year - 1);
  }

  return String(year);
}
