'use client';

import { useMemo, useReducer } from 'react';

import { toDateKey } from '@/utils/date';
import {
  colorHex,
  createFormState,
  formatDateText,
  formatTimeText,
  hasInvalidRange,
  toDateTime,
  reduceForm,
} from '../lib/form-utils';
import type { ScheduleCreateRequest } from '../types/request';
import type { PickerTarget, ScheduleColorToken } from '../types/form';
import type { Schedule } from '../types/ui-model';

type UseScheduleFormOptions = {
  initialDate?: Date;
  schedule?: Schedule;
  onSaveAction: (payload: ScheduleCreateRequest) => void | Promise<void>;
};

export function useScheduleForm({ initialDate, schedule, onSaveAction }: UseScheduleFormOptions) {
  const [state, dispatch] = useReducer(
    reduceForm,
    { initialDate, schedule },
    createFormState,
  );

  const startDateText = useMemo(() => formatDateText(state.startAt), [state.startAt]);
  const endDateText = useMemo(() => formatDateText(state.endAt), [state.endAt]);
  const startTimeText = useMemo(() => formatTimeText(state.startAt), [state.startAt]);
  const endTimeText = useMemo(() => formatTimeText(state.endAt), [state.endAt]);
  const invalidTimeRange = useMemo(
    () => !state.allDay && hasInvalidRange(state.startAt, state.endAt),
    [state.allDay, state.endAt, state.startAt],
  );
  const pickerTarget = state.picker;
  const pickerValue = pickerTarget === 'end' ? state.endAt : state.startAt;

  const save = () => {
    if (invalidTimeRange) {
      return;
    }

    const payload: ScheduleCreateRequest = {
      color: colorHex(state.color),
      title: state.title.trim(),
      location: state.place.trim(),
      startAt: state.allDay ? `${toDateKey(state.startAt)}T00:00:00` : toDateTime(state.startAt),
      endAt: state.allDay ? `${toDateKey(state.endAt)}T23:59:59` : toDateTime(state.endAt),
    };

    void onSaveAction(payload);
  };

  return {
    form: {
      title: state.title,
      setTitle: (value: string) => dispatch({ type: 'text', key: 'title', value }),
      place: state.place,
      setPlace: (value: string) => dispatch({ type: 'text', key: 'place', value }),
      allDay: state.allDay,
      setAllDay: (value: boolean) => dispatch({ type: 'allDay', value }),
      color: state.color,
      setColor: (value: ScheduleColorToken) => dispatch({ type: 'color', value }),
      startAt: state.startAt,
      endAt: state.endAt,
    },
    view: {
      startDateText,
      endDateText,
      startTimeText,
      endTimeText,
      invalidTimeRange,
      pickerValue,
    },
    picker: {
      target: pickerTarget,
      open: (target: PickerTarget) =>
        dispatch({ type: 'picker', value: pickerTarget === target ? null : target }),
      close: () => dispatch({ type: 'picker', value: null }),
      confirm: (value: Date) => {
        if (!pickerTarget) return;

        dispatch({ type: 'datetime', target: pickerTarget, value });
        dispatch({ type: 'picker', value: null });
      },
    },
    action: {
      save,
    },
  };
}
