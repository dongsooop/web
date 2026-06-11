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

export const timeOptions = Array.from(
  { length: (timeEnd - timeStart) / timeStep + 1 },
  (_, i) => {
    const total = timeStart + i * timeStep;
    const hour = String(Math.floor(total / 60)).padStart(2, '0');
    const minute = String(total % 60).padStart(2, '0');

    return `${hour}:${minute}`;
  },
);

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

export type WeekKey =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type TimetableItem = {
  id: number;
  name: string;
  professor: string;
  location: string;
  startAt: string;
  endAt: string;
  week: WeekKey;
};

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

export const mockTimetable: TimetableItem[] = [
  {
    id: 1,
    name: '데이터베이스',
    professor: '김도윤',
    location: '2-305',
    startAt: '09:00:00',
    endAt: '12:00:00',
    week: 'MONDAY',
  },
  {
    id: 2,
    name: '시스템프로그래밍',
    professor: '박성훈',
    location: '3-109',
    startAt: '11:00:00',
    endAt: '12:00:00',
    week: 'TUESDAY',
  },
  {
    id: 3,
    name: '인공지능개론',
    professor: '최은서',
    location: '1-402',
    startAt: '10:00:00',
    endAt: '11:00:00',
    week: 'WEDNESDAY',
  },
  {
    id: 4,
    name: '모바일프로그래밍',
    professor: '이재훈',
    location: '3-314',
    startAt: '10:00:00',
    endAt: '13:00:00',
    week: 'FRIDAY',
  },
  {
    id: 5,
    name: '빅데이터실습',
    professor: '정유진',
    location: '6-315',
    startAt: '14:00:00',
    endAt: '17:00:00',
    week: 'MONDAY',
  },
  {
    id: 6,
    name: '알고리즘',
    professor: '한지민',
    location: '3-215',
    startAt: '14:00:00',
    endAt: '17:00:00',
    week: 'TUESDAY',
  },
  {
    id: 7,
    name: '백엔드실습',
    professor: '서민석',
    location: '3-314',
    startAt: '16:00:00',
    endAt: '17:00:00',
    week: 'WEDNESDAY',
  },
  {
    id: 8,
    name: 'HCI 개론',
    professor: '오세린',
    location: '2-207',
    startAt: '16:00:00',
    endAt: '17:00:00',
    week: 'FRIDAY',
  },
  {
    id: 9,
    name: '캡스톤디자인',
    professor: '문태수',
    location: '산학협력관 401',
    startAt: '19:00:00',
    endAt: '20:00:00',
    week: 'FRIDAY',
  },
];
