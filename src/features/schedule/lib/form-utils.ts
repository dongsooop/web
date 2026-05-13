import { DAY_LABELS, fromDateKey, toDateKey, toTimeKey } from '@/utils/date';
import type { FormAction, FormState } from '../types/form';
import type { Schedule } from '../types/ui-model';

function copyDate(value: Date) {
  return new Date(value);
}

function setDatePart(base: Date, next: Date) {
  const value = copyDate(base);
  value.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());
  return value;
}

function createDefaultStartAt(now: Date) {
  const startAt = copyDate(now);

  startAt.setSeconds(0, 0);
  startAt.setMinutes(Math.ceil(startAt.getMinutes() / 5) * 5, 0, 0);

  return startAt;
}

function applyDatePart(base: Date, next: Date) {
  const value = copyDate(base);
  value.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());
  return value;
}

function createDefaultEndAt(startAt: Date) {
  const endAt = copyDate(startAt);

  endAt.setHours(endAt.getHours() + 1);

  return endAt;
}

export function toDateTime(value: Date) {
  return `${toDateKey(value)}T${toTimeKey(value)}:00`;
}

export function hasInvalidRange(startAt: Date, endAt: Date) {
  return startAt.getTime() >= endAt.getTime();
}

export function formatDateText(value: Date) {
  const week = DAY_LABELS[value.getDay()];

  return `${toDateKey(value).replaceAll('-', '.')} (${week})`;
}

export function formatTimeText(value: Date) {
  return toTimeKey(value);
}

function toDate(dateKey: string, timeKey: string) {
  const date = fromDateKey(dateKey);
  if (!date) {
    return new Date();
  }

  const [hour, minute] = timeKey.split(':').map(Number);
  const value = new Date(date);
  value.setHours(hour, minute, 0, 0);

  return Number.isNaN(value.getTime()) ? new Date() : value;
}

function isAllDaySchedule(schedule: Schedule) {
  return schedule.startAt === '00:00' && schedule.endAt === '23:59';
}

type FormStateInit = {
  initialDate?: Date;
  schedule?: Schedule;
};

export function createFormState({ initialDate, schedule }: FormStateInit = {}) {
  if (schedule) {
    return {
      title: schedule.title,
      place: schedule.location,
      allDay: isAllDaySchedule(schedule),
      color: 'red',
      startAt: toDate(schedule.startDateKey, schedule.startAt),
      endAt: toDate(schedule.endDateKey, schedule.endAt),
      picker: null,
    } satisfies FormState;
  }

  const now = initialDate ? applyDatePart(new Date(), initialDate) : new Date();
  const startAt = createDefaultStartAt(now);
  const endAt = createDefaultEndAt(startAt);

  return {
    title: '',
    place: '',
    allDay: false,
    color: 'red',
    startAt,
    endAt,
    picker: null,
  } satisfies FormState;
}

export function reduceForm(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'text':
      return { ...state, [action.key]: action.value };
    case 'allDay':
      return { ...state, allDay: action.value };
    case 'color':
      return { ...state, color: action.value };
    case 'picker':
      return { ...state, picker: action.value };
    case 'datetime':
      if (action.target === 'start') {
        const startAt = copyDate(action.value);

        if (toDateKey(startAt) > toDateKey(state.endAt)) {
          return {
            ...state,
            startAt,
            endAt: setDatePart(state.endAt, startAt),
          };
        }

        return {
          ...state,
          startAt,
        };
      }

      if (toDateKey(action.value) < toDateKey(state.startAt)) {
        return {
          ...state,
          endAt: setDatePart(action.value, state.startAt),
        };
      }

      return {
        ...state,
        endAt: copyDate(action.value),
      };
    default:
      return state;
  }
}
