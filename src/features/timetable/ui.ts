import type {
  TimetableLectureResponse as TimetableItem,
  TimetableWeekKey as WeekKey,
} from './types/response';

export type { TimetableItem, WeekKey };

export type TimetablePreview = {
  endAt: string;
  startAt: string;
  week: WeekKey;
};

export const timetableStartHour = 9;
export const timetableEndHour = 22;

export const timetableDays = ['월', '화', '수', '목', '금'] as const;
export const timetableHours = Array.from(
  { length: timetableEndHour - timetableStartHour + 1 },
  (_, i) => timetableStartHour + i,
);

export const timetableWeekDays = [
  { key: 'MONDAY', label: '월' },
  { key: 'TUESDAY', label: '화' },
  { key: 'WEDNESDAY', label: '수' },
  { key: 'THURSDAY', label: '목' },
  { key: 'FRIDAY', label: '금' },
] as const;

const timeStep = 5;
const timeStart = timetableStartHour * 60;
const timeEnd = 22 * 60;

export const timetableTimeOptions = Array.from(
  { length: (timeEnd - timeStart) / timeStep + 1 },
  (_, i) => {
    const total = timeStart + i * timeStep;
    const hour = String(Math.floor(total / 60)).padStart(2, '0');
    const minute = String(total % 60).padStart(2, '0');

    return `${hour}:${minute}`;
  },
);

export const timetableTones = {
  mint: 'border-mint bg-mint-soft text-mint-strong',
  sky: 'border-sky bg-sky-soft text-sky-strong',
  violet: 'border-violet bg-violet-soft text-violet-strong',
  rose: 'border-rose bg-rose-soft text-rose-strong',
  amber: 'border-amber bg-amber-soft text-amber-strong',
  teal: 'border-teal bg-teal-soft text-teal-strong',
  indigo: 'border-indigo bg-indigo-soft text-indigo-strong',
  peach: 'border-peach bg-peach-soft text-peach-strong',
  lime: 'border-lime bg-lime-soft text-lime-strong',
  coral: 'border-coral bg-coral-soft text-coral-strong',
} as const;

export type TimetableToneKey = keyof typeof timetableTones;

const timetableWeekLabelMap: Record<WeekKey, string> = {
  FRIDAY: '금요일',
  MONDAY: '월요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
  THURSDAY: '목요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
};

export function getTimetableWeekLabel(week: WeekKey) {
  return timetableWeekLabelMap[week];
}
