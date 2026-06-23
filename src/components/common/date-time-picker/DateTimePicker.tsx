'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { lockBody, unlockBody } from '@/lib/body-lock';
import { toDateKey } from '@/utils/date';

import DateTimeWheel from './DateTimeWheel';
import {
  buildDateItems,
  buildHourItems,
  buildMinuteItems,
  mergeDate,
  mergeTime,
  padTime,
  WHEEL_VIEW_H,
} from './utils';

type DateTimePickerProps = {
  open: boolean;
  title: string;
  value: Date;
  minDate?: Date;
  onCloseAction: () => void;
  onConfirmAction: (value: Date) => void;
};

export default function DateTimePicker({
  open,
  title,
  value,
  minDate,
  onCloseAction,
  onConfirmAction,
}: DateTimePickerProps) {
  const [draft, setDraft] = useState(() => value);

  const dateKey = toDateKey(draft);
  const minDateKey = minDate ? toDateKey(minDate) : undefined;

  const dateItems = useMemo(() => buildDateItems(dateKey, minDateKey), [dateKey, minDateKey]);
  const hourItems = useMemo(() => buildHourItems(), []);
  const minuteItems = useMemo(() => buildMinuteItems(), []);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    lockBody();

    return () => {
      unlockBody();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 px-0 sm:items-center sm:px-4"
      onClick={onCloseAction}
    >
      <div
        className="w-full rounded-t-xl bg-white shadow-[0_20px_48px_rgba(15,23,42,0.14)] sm:max-w-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-body font-semibold text-black">{title}</div>

            <button
              type="button"
              onClick={onCloseAction}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative overflow-hidden" style={{ height: WHEEL_VIEW_H }}>
            <div className="bg-gray7 pointer-events-none absolute inset-x-3 top-1/2 z-0 h-12 -translate-y-1/2 rounded-2xl" />

            <div className="grid h-full grid-cols-[minmax(0,3.2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-0">
              <DateTimeWheel
                items={dateItems}
                value={dateKey}
                widthClassName="min-w-0 pl-4"
                onChangeAction={(nextValue) => setDraft(mergeDate(draft, nextValue))}
              />

              <DateTimeWheel
                items={hourItems}
                value={padTime(draft.getHours())}
                loop
                widthClassName="min-w-0"
                onChangeAction={(nextValue) => setDraft(mergeTime(draft, 'hour', nextValue))}
              />

              <DateTimeWheel
                items={minuteItems}
                value={padTime(draft.getMinutes())}
                loop
                widthClassName="min-w-0 pr-4"
                onChangeAction={(nextValue) => setDraft(mergeTime(draft, 'minute', nextValue))}
              />
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-3 py-2">
            <Button
              onClick={onCloseAction}
              color="text"
              className="text-bodySm border-gray2 text-gray6 min-h-11 border bg-white"
            >
              취소
            </Button>

            <Button
              onClick={() => onConfirmAction(draft)}
              className="text-bodySm min-h-11"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
