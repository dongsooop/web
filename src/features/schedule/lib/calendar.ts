import { DAY_LABELS, dateKeysBetween, toDateKey } from '@/utils/date';
import type { Schedule } from '../types/ui-model';

export const WEEK_LABELS = DAY_LABELS;

export type CalendarCell = {
  date: number | null;
  key: string;
};

export type MonthlyCalendarCell = {
  key: string;
  date: Date;
  inMonth: boolean;
};

export type CalendarRangeSegment = {
  row: number;
  lane: number;
  startCol: number;
  endCol: number;
  label: string;
  range: string;
  showText: boolean;
  style: string;
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

export function buildMonthlyCalendarCells(view: Date): MonthlyCalendarCell[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      key: toDateKey(date),
      date,
      inMonth: date.getMonth() === month,
    };
  });
}

export function moveMonthState(view: Date, selectedDateKey: string, delta: number) {
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
  return schedules.filter(
    (schedule) => schedule.startDateKey <= dateKey && schedule.endDateKey >= dateKey,
  );
}

export function groupSchedulesByDate(schedules: Schedule[]) {
  return schedules.reduce<Record<string, Schedule[]>>((acc, schedule) => {
    const keys = dateKeysBetween(schedule.startDateKey, schedule.endDateKey);

    keys.forEach((dateKey) => {
      const saved = acc[dateKey] ?? [];
      saved.push(schedule);
      acc[dateKey] = saved;
    });

    return acc;
  }, {});
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
  if (schedule.type === 'OFFICIAL') {
    return '학사일정';
  }

  if (schedule.startAt === '00:00' && schedule.endAt === '23:59') {
    return '종일';
  }

  return `${schedule.startAt} - ${schedule.endAt}`;
}

export function formatShortScheduleDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const week = WEEK_LABELS[new Date(year, month - 1, day).getDay()];
  return `${month}.${day} (${week})`;
}

export function formatScheduleDateText(schedule: Schedule) {
  if (schedule.startDateKey !== schedule.endDateKey) {
    return `${formatShortScheduleDate(schedule.startDateKey)} - ${formatShortScheduleDate(schedule.endDateKey)}`;
  }

  return formatShortScheduleDate(schedule.startDateKey);
}

export function formatScheduleTimeText(schedule: Schedule) {
  if (schedule.type === 'OFFICIAL') {
    return '';
  }

  if (schedule.startAt === '00:00' && schedule.endAt === '23:59') {
    return '종일';
  }

  return `${schedule.startAt} - ${schedule.endAt}`;
}

export function formatScheduleRange(schedule: Schedule) {
  if (schedule.startDateKey === schedule.endDateKey) {
    return '';
  }

  const [startYear, startMonth, startDay] = schedule.startDateKey.split('-').map(Number);
  const [endYear, endMonth, endDay] = schedule.endDateKey.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);
  const startWeek = WEEK_LABELS[startDate.getDay()];
  const endWeek = WEEK_LABELS[endDate.getDay()];

  return `${startMonth}.${startDay} (${startWeek}) - ${endMonth}.${endDay} (${endWeek})`;
}

export function buildScheduleSegments(
  cells: MonthlyCalendarCell[],
  schedules: Schedule[],
  toneOf: (schedule: Schedule) => string,
): CalendarRangeSegment[] {
  const indexMap = new Map(cells.map((cell, index) => [cell.key, index]));
  const firstKey = cells[0]?.key;
  const lastKey = cells[cells.length - 1]?.key;

  if (!firstKey || !lastKey) {
    return [];
  }

  const laneMap = new Map<number, number[]>();

  return schedules.flatMap((schedule) => {
    if (schedule.endDateKey < firstKey || schedule.startDateKey > lastKey) {
      return [];
    }

    const visibleStart = schedule.startDateKey < firstKey ? firstKey : schedule.startDateKey;
    const visibleEnd = schedule.endDateKey > lastKey ? lastKey : schedule.endDateKey;
    const startIndex = indexMap.get(visibleStart);
    const endIndex = indexMap.get(visibleEnd);

    if (startIndex == null || endIndex == null) {
      return [];
    }

    const row = Math.floor(startIndex / 7);
    const rowEnd = row * 7 + 6;
    const segmentEnd = Math.min(endIndex, rowEnd);
    const startCol = startIndex % 7;
    const endCol = segmentEnd % 7;
    const lanes = laneMap.get(row) ?? [];
    let lane = lanes.findIndex((lastEndCol) => startCol > lastEndCol);

    if (lane === -1) {
      lane = lanes.length;
      lanes.push(endCol);
    } else {
      lanes[lane] = endCol;
    }

    laneMap.set(row, lanes);

    return [
      {
        row,
        lane,
        startCol,
        endCol,
        label: schedule.title,
        range: formatScheduleRange(schedule),
        showText: true,
        style: toneOf(schedule),
      },
    ];
  });
}

export function buildLaneOffsetMap(cells: MonthlyCalendarCell[], segments: CalendarRangeSegment[]) {
  return segments.reduce<Record<string, number>>((map, segment) => {
    for (let col = segment.startCol; col <= segment.endCol; col += 1) {
      const cell = cells[segment.row * 7 + col];

      if (!cell) {
        continue;
      }

      const count = segment.lane + 1;
      map[cell.key] = Math.max(map[cell.key] ?? 0, count);
    }

    return map;
  }, {});
}

export function formatCalendarDateLabel(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function getScheduleCountText(count: number) {
  if (count === 0) {
    return '일정 없음';
  }

  return `일정 ${count}개`;
}
