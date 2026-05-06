import { toDateKey, toTimeKey } from '@/utils/date';
import type { Schedule } from './types/model';
import type { ScheduleResponse, ScheduleResponseItem, ScheduleType } from './types/response';

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTime(value: string) {
  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : null;
}

function getDateKey(item: ScheduleResponseItem) {
  const startDate = parseDate(item.startAt);
  if (startDate) {
    return toDateKey(startDate);
  }

  const endDate = parseDate(item.endAt);
  if (endDate) {
    return toDateKey(endDate);
  }

  return '';
}

function getTime(value: string) {
  const time = parseTime(value);
  if (time) {
    return time;
  }

  const parsedDate = parseDate(value);
  if (parsedDate) {
    return toTimeKey(parsedDate);
  }

  return '00:00';
}

function parseType(value: unknown): ScheduleType {
  if (typeof value === 'string' && value.toUpperCase() === 'OFFICIAL') {
    return 'OFFICIAL';
  }
  return 'MEMBER';
}

function getTitle(item: ScheduleResponseItem) {
  return item.title.trim() ? item.title.trim() : '일정';
}

function toModel(item: ScheduleResponseItem): Schedule | null {
  const type = parseType(item.type);
  const dateKey = getDateKey(item);

  if (!dateKey) {
    return null;
  }

  const startAt = getTime(item.startAt);
  const endAt = getTime(item.endAt);

  return {
    id: item.id,
    title: getTitle(item),
    location: item.location,
    dateKey,
    startAt,
    endAt,
    type,
  };
}

export function toModelList(dto: ScheduleResponse): Schedule[] {
  return (dto.schedules ?? [])
    .map(toModel)
    .filter((item): item is Schedule => item !== null);
}
