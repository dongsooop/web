import { DAY_LABELS, toDateKey, toTimeKey } from '@/utils/date';
import type { FormAction, FormState } from '../types/form';

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

export function createFormState() {
  const now = new Date();
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
