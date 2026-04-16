import { toDateKey } from './date';
import type { Schedule } from '../types/model';

export const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export type CalendarCell = {
  date: number | null;
  key: string;
};

type VisibleSchedulesResult = {
  visibleSchedules: Schedule[];
  overflowCount: number;
};

export function buildCalendarCells(view: Date): CalendarCell[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: null, key: `e-${i}` });
  }

  for (let date = 1; date <= lastDate; date++) {
    cells.push({ date, key: `d-${date}` });
  }

  return cells;
}

export function shiftCalendarMonth(view: Date, selectedDateKey: string, delta: number) {
  const nextView = new Date(view.getFullYear(), view.getMonth() + delta, 1);
  const selectedDay = Number(selectedDateKey.slice(8, 10)) || 1;
  const nextLastDate = new Date(nextView.getFullYear(), nextView.getMonth() + 1, 0).getDate();
  const nextSelected = new Date(
    nextView.getFullYear(),
    nextView.getMonth(),
    Math.min(selectedDay, nextLastDate),
  );

  return {
    view: nextView,
    selectedDateKey: toDateKey(nextSelected),
  };
}

export function sortSchedules(schedules: Schedule[]) {
  return [...schedules].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'OFFICIAL' ? -1 : 1;
    }

    return a.startAt.localeCompare(b.startAt);
  });
}

export function filterSchedulesByDate(schedules: Schedule[], dateKey: string) {
  return schedules.filter((schedule) => schedule.dateKey === dateKey);
}

export function getVisibleSchedules(
  schedules: Schedule[],
  dateKey: string,
  visibleCount = 3,
): VisibleSchedulesResult {
  const sortedSchedules = sortSchedules(filterSchedulesByDate(schedules, dateKey));
  const visibleSchedules = sortedSchedules.slice(0, visibleCount);

  return {
    visibleSchedules,
    overflowCount: Math.max(sortedSchedules.length - visibleSchedules.length, 0),
  };
}

export function formatScheduleTimeLabel(schedule: Schedule) {
  return schedule.type === 'OFFICIAL' ? '학사' : `${schedule.startAt} - ${schedule.endAt}`;
}
