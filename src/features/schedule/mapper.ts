import type { ScheduleResponse, ScheduleType } from './types/response';
import type { ScheduleUiItem, ScheduleUiModel } from './types/ui-model';

type RawScheduleRecord = Record<string, unknown>;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTime(value: Date) {
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function parseDateValue(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeTimeString(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : null;
}

function resolveDateKey(item: RawScheduleRecord) {
  const directDate = item.date ?? item.scheduleDate ?? item.day;
  if (typeof directDate === 'string') {
    return directDate.slice(0, 10);
  }

  const startDate = parseDateValue(item.startAt ?? item.startDate ?? item.startedAt);
  if (startDate) {
    return toDateKey(startDate);
  }

  const endDate = parseDateValue(item.endAt ?? item.endDate ?? item.endedAt);
  if (endDate) {
    return toDateKey(endDate);
  }

  return '';
}

function resolveTime(item: RawScheduleRecord, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    const normalized = normalizeTimeString(value);
    if (normalized) {
      return normalized;
    }

    const parsedDate = parseDateValue(value);
    if (parsedDate) {
      return toTime(parsedDate);
    }
  }

  return '00:00';
}

function normalizeType(value: unknown): ScheduleType {
  if (typeof value === 'string' && value.toUpperCase() === 'OFFICIAL') {
    return 'OFFICIAL';
  }
  return 'MEMBER';
}

function normalizeTitle(item: RawScheduleRecord) {
  const value = item.title ?? item.name ?? item.scheduleName ?? item.content;

  return typeof value === 'string' && value.trim() ? value.trim() : '일정';
}

function toUiSchedule(item: RawScheduleRecord): ScheduleUiItem | null {
  const type = normalizeType(item.type ?? item.scheduleType ?? item.category);
  const dateKey = resolveDateKey(item);

  if (!dateKey) {
    return null;
  }

  const startAt = resolveTime(item, ['startAt', 'startDate', 'startedAt', 'time']);
  const endAt = resolveTime(item, ['endAt', 'endDate', 'endedAt']);

  return {
    title: normalizeTitle(item),
    dateKey,
    startAt,
    endAt,
    type,
    displayTime: type === 'OFFICIAL' ? '학사' : `${startAt} - ${endAt}`,
  };
}

export function mapScheduleResponseToUi(dto: ScheduleResponse): ScheduleUiModel {
  return {
    schedules: (dto.schedules ?? [])
      .map((item) => toUiSchedule(item as unknown as RawScheduleRecord))
      .filter((item): item is ScheduleUiItem => item !== null),
  };
}
