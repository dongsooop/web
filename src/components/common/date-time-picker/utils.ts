import { DAY_LABELS, toDateKey } from '@/utils/date';
import { WheelItem } from './types';


export const WHEEL_ROW_H = 48;
export const WHEEL_VIEW_H = WHEEL_ROW_H * 7;
export const WHEEL_LOOP_COUNT = 20;
export const WHEEL_CONTENT_PAD = WHEEL_VIEW_H / 2 - WHEEL_ROW_H / 2;

export function padTime(value: number) {
  return String(value).padStart(2, '0');
}

export function copyDate(value: Date) {
  return new Date(value);
}

export function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function mergeDate(base: Date, nextDate: string) {
  const next = parseDateKey(nextDate);
  const value = copyDate(base);

  value.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());

  return value;
}

export function mergeTime(base: Date, key: 'hour' | 'minute', nextValue: string) {
  const value = copyDate(base);

  if (key === 'hour') {
    value.setHours(Number(nextValue));
    return value;
  }

  value.setMinutes(Number(nextValue));
  return value;
}

export function buildDateItems(dateKey: string, minDateKey?: string): WheelItem[] {
  const date = parseDateKey(dateKey);
  const firstYear = date.getFullYear() - 5;
  const lastYear = date.getFullYear() + 5;
  const start = new Date(firstYear, 0, 1);
  const end = new Date(lastYear, 11, 31);
  const items: WheelItem[] = [];

  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const next = new Date(current);
    const nextDateKey = toDateKey(next);

    if (minDateKey && nextDateKey < minDateKey) {
      continue;
    }

    items.push({
      key: nextDateKey,
      value: nextDateKey,
      label: `${nextDateKey.replaceAll('-', '.')} (${DAY_LABELS[next.getDay()]})`,
    });
  }

  return items;
}

export function buildHourItems(): WheelItem[] {
  return Array.from({ length: 24 }, (_, index) => {
    const hour = padTime(index);

    return {
      key: hour,
      value: hour,
      label: `${hour}시`,
    };
  });
}

export function buildMinuteItems(): WheelItem[] {
  return Array.from({ length: 12 }, (_, index) => {
    const minute = padTime(index * 5);

    return {
      key: minute,
      value: minute,
      label: `${minute}분`,
    };
  });
}

export function lockBody() {
  document.body.style.overflow = 'hidden';
}

export function unlockBody() {
  document.body.style.overflow = '';
}
