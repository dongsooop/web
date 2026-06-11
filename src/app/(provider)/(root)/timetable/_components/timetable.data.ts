import type {
  TimetableLectureResponse as TimetableItem,
  TimetableWeekKey as WeekKey,
} from '@/features/timetable/types/response';

export type { TimetableItem, WeekKey };

export const startHour = 9;
export const endHour = 19;

export const days = ['월', '화', '수', '목', '금'] as const;
export const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
export const weekDays = [
  { key: 'MONDAY', label: '월' },
  { key: 'TUESDAY', label: '화' },
  { key: 'WEDNESDAY', label: '수' },
  { key: 'THURSDAY', label: '목' },
  { key: 'FRIDAY', label: '금' },
] as const;
const timeStep = 5;
const timeStart = 7 * 60;
const timeEnd = 22 * 60;

export const timeOptions = Array.from({ length: (timeEnd - timeStart) / timeStep + 1 }, (_, i) => {
  const total = timeStart + i * timeStep;
  const hour = String(Math.floor(total / 60)).padStart(2, '0');
  const minute = String(total % 60).padStart(2, '0');

  return `${hour}:${minute}`;
});

export const tones = {
  mint: 'border-schedule-mintLine bg-schedule-mintBg text-schedule-mintText',
  sky: 'border-schedule-skyLine bg-schedule-skyBg text-schedule-skyText',
  violet: 'border-schedule-violetLine bg-schedule-violetBg text-schedule-violetText',
  rose: 'border-schedule-roseLine bg-schedule-roseBg text-schedule-roseText',
  amber: 'border-schedule-amberLine bg-schedule-amberBg text-schedule-amberText',
  teal: 'border-schedule-tealLine bg-schedule-tealBg text-schedule-tealText',
  indigo: 'border-schedule-indigoLine bg-schedule-indigoBg text-schedule-indigoText',
  peach: 'border-schedule-peachLine bg-schedule-peachBg text-schedule-peachText',
  lime: 'border-schedule-limeLine bg-schedule-limeBg text-schedule-limeText',
  coral: 'border-schedule-coralLine bg-schedule-coralBg text-schedule-coralText',
} as const;

export type ToneKey = keyof typeof tones;

export function weekLabel(week: WeekKey) {
  const map: Record<WeekKey, string> = {
    FRIDAY: '금요일',
    MONDAY: '월요일',
    SATURDAY: '토요일',
    SUNDAY: '일요일',
    THURSDAY: '목요일',
    TUESDAY: '화요일',
    WEDNESDAY: '수요일',
  };

  return map[week];
}
