import { toDateKey, toTimeKey } from './lib/date';
import type { Schedule } from './types/model';
import type { ScheduleResponse, ScheduleType } from './types/response';

type RawScheduleRecord = Record<string, unknown>;

function parseDate(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTime(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : null;
}

function getDateKey(item: RawScheduleRecord) {
  const directDate = item.date ?? item.scheduleDate ?? item.day;
  if (typeof directDate === 'string') {
    return directDate.slice(0, 10);
  }

  const startDate = parseDate(item.startAt ?? item.startDate ?? item.startedAt);
  if (startDate) {
    return toDateKey(startDate);
  }

  const endDate = parseDate(item.endAt ?? item.endDate ?? item.endedAt);
  if (endDate) {
    return toDateKey(endDate);
  }

  return '';
}

function getTime(item: RawScheduleRecord, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    const time = parseTime(value);
    if (time) {
      return time;
    }

    const parsedDate = parseDate(value);
    if (parsedDate) {
      return toTimeKey(parsedDate);
    }
  }

  return '00:00';
}

function parseType(value: unknown): ScheduleType {
  if (typeof value === 'string' && value.toUpperCase() === 'OFFICIAL') {
    return 'OFFICIAL';
  }
  return 'MEMBER';
}

function getTitle(item: RawScheduleRecord) {
  const value = item.title ?? item.name ?? item.scheduleName ?? item.content;

  return typeof value === 'string' && value.trim() ? value.trim() : '일정';
}

function toModel(item: RawScheduleRecord): Schedule | null {
  const type = parseType(item.type ?? item.scheduleType ?? item.category);
  const dateKey = getDateKey(item);

  if (!dateKey) {
    return null;
  }

  const startAt = getTime(item, ['startAt', 'startDate', 'startedAt', 'time']);
  const endAt = getTime(item, ['endAt', 'endDate', 'endedAt']);

  return {
    title: getTitle(item),
    dateKey,
    startAt,
    endAt,
    type,
  };
}

export function toModelList(dto: ScheduleResponse): Schedule[] {
  return (dto.schedules ?? [])
    .map((item) => toModel(item as unknown as RawScheduleRecord))
    .filter((item): item is Schedule => item !== null);
}
