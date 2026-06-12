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
const timeEnd = timetableEndHour * 60;

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
  mint: 'border-mint-500 bg-mint-50 text-mint-700',
  sky: 'border-sky-500 bg-sky-50 text-sky-700',
  violet: 'border-violet-500 bg-violet-50 text-violet-700',
  rose: 'border-rose-500 bg-rose-50 text-rose-700',
  amber: 'border-amber-500 bg-amber-50 text-amber-700',
  teal: 'border-teal-500 bg-teal-50 text-teal-700',
  indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700',
  peach: 'border-peach-500 bg-peach-50 text-peach-700',
  lime: 'border-lime-500 bg-lime-50 text-lime-700',
  coral: 'border-coral-500 bg-coral-50 text-coral-700',
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
