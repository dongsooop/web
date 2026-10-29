'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { lockBody, unlockBody } from '@/lib/body-lock';

import DateTimeWheel from './DateTimeWheel';
import { WHEEL_VIEW_H, type WheelItem } from './utils';

type TimePickerProps = {
  open: boolean;
  options: string[];
  title: string;
  value: string;
  onCloseAction: () => void;
  onConfirmAction: (value: string) => void;
};

export default function TimePicker({
  open,
  options,
  title,
  value,
  onCloseAction,
  onConfirmAction,
}: TimePickerProps) {
  const [draft, setDraft] = useState(value);

  const items = useMemo<WheelItem[]>(
    () =>
      options.map((option) => ({
        key: option,
        value: option,
        label: option,
      })),
    [options],
  );

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
        className="w-full rounded-t-xl bg-white shadow-[0_20px_48px_rgba(15,23,42,0.14)] sm:max-w-md sm:rounded-xl"
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

            <div className="grid h-full grid-cols-1 items-center">
              <DateTimeWheel
                key={`${title}-${value}`}
                items={items}
                value={draft}
                widthClassName="min-w-0 px-4"
                onChangeAction={setDraft}
              />
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-3 py-2">
            <Button
              onClick={onCloseAction}
              color="outline"
              className="text-bodySm min-h-11"
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
