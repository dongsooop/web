'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';

import { buildMonthlyCalendarCells, WEEK_LABELS } from '@/features/schedule/lib/calendar';
import { dateColorClass, weekColorClass } from '@/features/schedule/lib/color';
import { toDateKey } from '@/utils/date';

type ScheduleDatePickerProps = {
  open: boolean;
  value: string;
  min?: string;
  onCloseAction: () => void;
  onConfirmAction: (value: string) => void;
};

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function titleText(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function lockBody() {
  const { body, documentElement } = document;
  const count = Number(body.dataset.pickerLockCount ?? '0');

  if (count === 0) {
    body.dataset.pickerOverflow = body.style.overflow;
    body.dataset.pickerPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  body.dataset.pickerLockCount = String(count + 1);
}

function unlockBody() {
  const { body } = document;
  const count = Number(body.dataset.pickerLockCount ?? '0');

  if (count <= 1) {
    body.style.overflow = body.dataset.pickerOverflow ?? '';
    body.style.paddingRight = body.dataset.pickerPaddingRight ?? '';
    delete body.dataset.pickerLockCount;
    delete body.dataset.pickerOverflow;
    delete body.dataset.pickerPaddingRight;
    return;
  }

  body.dataset.pickerLockCount = String(count - 1);
}

export default function ScheduleDatePicker({
  open,
  value,
  min,
  onCloseAction,
  onConfirmAction,
}: ScheduleDatePickerProps) {
  const [selected, setSelected] = useState(() => value);
  const [view, setView] = useState(() => parseDateKey(value));
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const cells = useMemo(() => buildMonthlyCalendarCells(view), [view]);

  useEffect(() => {
    if (!open) return;

    lockBody();

    return () => {
      unlockBody();
    };
  }, [open, value]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 px-0 sm:items-center sm:px-4"
      onClick={onCloseAction}
    >
      <div
        className="w-full rounded-t-xl bg-white sm:max-w-lg sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-body font-semibold text-black">날짜 선택</div>
            <button
              type="button"
              onClick={onCloseAction}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="이전 달"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <div className="text-body font-semibold text-black">{titleText(view)}</div>
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="다음 달"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>

          <div className="py-3">
            <div className="mb-2 grid grid-cols-7">
              {WEEK_LABELS.map((day, index) => (
                <div
                  key={day}
                  className={[
                    'text-caption flex h-9 items-center justify-center font-semibold',
                    weekColorClass(index),
                  ].join(' ')}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((cell) => {
                const key = toDateKey(cell.date);
                const disabled = Boolean(min && key < min);
                const isToday = key === todayKey;
                const isSelected = key === selected;
                const textColor = dateColorClass(cell.date, cell.inMonth);

                return (
                  <button
                    key={cell.key}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelected(key);
                      setView(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                    }}
                    className={[
                      'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center justify-self-center rounded-full transition',
                      disabled ? 'cursor-default opacity-30' : '',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-bodySm inline-flex h-8 w-8 items-center justify-center rounded-full font-semibold transition',
                        textColor,
                        isSelected ? 'bg-primary text-white' : '',
                        isToday && !isSelected ? 'bg-gray7 text-black' : '',
                      ].join(' ')}
                    >
                      {cell.date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center py-2">
            <button
              type="button"
              onClick={() => {
                setSelected(todayKey);
                setView(parseDateKey(todayKey));
              }}
              className="text-bodySm border-gray2 text-gray6 min-h-11 flex-1 cursor-pointer rounded-xl border bg-white px-4 font-semibold"
            >
              오늘
            </button>
            <div className="flex-[2]" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onConfirmAction(selected)}
              className="text-bodySm bg-primary min-h-11 flex-[3] cursor-pointer rounded-xl px-4 font-semibold text-white"
            >
              선택 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
