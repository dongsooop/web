'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Divider } from './Divider';

export type TimePickerProps = {
  open: boolean;
  value: string;
  title?: string;
  onCloseAction: () => void;
  onConfirmAction: (value: string) => void;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function parseTime(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  const roundedMinute = Math.round(minute / 5) * 5;
  const safeMinute = roundedMinute === 60 ? 55 : roundedMinute;

  return {
    hour: pad(hour),
    minute: pad(safeMinute),
  };
}

type WheelProps = {
  items: string[];
  value: string;
  onChangeAction: (value: string) => void;
  side: 'left' | 'right';
};

const ROW_H = 48;
const VIEW_H = ROW_H * 7;
const LOOP_COUNT = 20;
const CONTENT_PAD = VIEW_H / 2 - ROW_H / 2;

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

function WheelPicker({ items, value, onChangeAction, side }: WheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const padding = useMemo(() => Array.from({ length: 2 }), []);
  const repeatedItems = useMemo(
    () =>
      Array.from({ length: LOOP_COUNT }, (_, loop) =>
        items.map((item) => ({
          key: `${loop}-${item}`,
          value: item,
        })),
      ).flat(),
    [items],
  );
  const initialIndex = useMemo(() => Math.max(items.indexOf(value), 0), [items, value]);
  const middleLoop = Math.floor(LOOP_COUNT / 2);
  const centerIndex = middleLoop * items.length + initialIndex;
  const [focusIndex, setFocusIndex] = useState(centerIndex);

  const alignMiddle = (index: number) => {
    const node = ref.current;

    if (!node) return;

    node.scrollTop = index * ROW_H;
  };

  useEffect(() => {
    if (readyRef.current) return;

    const node = ref.current;

    if (!node) return;

    alignMiddle(centerIndex);
    readyRef.current = true;
  }, [centerIndex]);

  const syncValue = () => {
    const node = ref.current;

    if (!node) return;

    const index = Math.round(node.scrollTop / ROW_H);
    const cycleSize = items.length;
    const normalized = ((index % cycleSize) + cycleSize) % cycleSize;
    const next = items[normalized];

    if (next && next !== value) {
      onChangeAction(next);
    }

    const cycle = Math.floor(index / cycleSize);
    let nextIndex = index;

    if (cycle < 2 || cycle > LOOP_COUNT - 3) {
      nextIndex = middleLoop * cycleSize + normalized;
      alignMiddle(nextIndex);
    }

    setFocusIndex(nextIndex);
  };

  return (
    <div className="relative z-10 h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/60 to-white/0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/60 to-white/0" />

      <div
        ref={ref}
        className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: CONTENT_PAD, paddingBottom: CONTENT_PAD }}
        onScroll={syncValue}
      >
        {padding.map((_, index) => (
          <div key={`pad-top-${index}`} aria-hidden="true" />
        ))}
        {repeatedItems.map((item, index) => {
          const distance = Math.abs(index - focusIndex);
          const level = distance > 3 ? 3 : distance;
          const toneMap = [
            { className: 'text-title font-bold text-black', opacity: 1 },
            { className: 'text-body font-semibold text-gray6', opacity: 0.72 },
            { className: 'text-bodySm font-semibold text-gray5', opacity: 0.5 },
            { className: 'text-bodySm font-semibold text-gray4', opacity: 0.4 },
          ] as const;
          const tone = toneMap[level];

          return (
            <button
              key={item.key}
              type="button"
              onClick={(e) => {
                const node = ref.current;
                const targetIndex = index;

                if (node) {
                  node.scrollTo({
                    top: e.currentTarget.offsetTop - CONTENT_PAD,
                    behavior: 'smooth',
                  });
                }

                setFocusIndex(targetIndex);
                onChangeAction(item.value);
              }}
              className={[
                'relative z-30 flex h-12 w-full cursor-pointer snap-center items-center leading-none transition',
                side === 'left' ? 'justify-end pr-6' : 'justify-start pl-6',
                tone.className,
              ].join(' ')}
              style={{ opacity: tone.opacity }}
            >
              {item.value}
            </button>
          );
        })}
        {padding.map((_, index) => (
          <div key={`pad-bottom-${index}`} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

export default function TimePicker({
  open,
  value,
  title = '시간 선택',
  onCloseAction,
  onConfirmAction,
}: TimePickerProps) {
  const initialTime = useMemo(() => parseTime(value), [value]);
  const [hour, setHour] = useState(() => initialTime.hour);
  const [minute, setMinute] = useState(() => initialTime.minute);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, index) => pad(index)), []);
  const minutes = useMemo(() => Array.from({ length: 12 }, (_, index) => pad(index * 5)), []);

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
        className="w-full rounded-t-xl bg-white shadow-[0_20px_48px_rgba(15,23,42,0.14)] sm:max-w-sm sm:rounded-xl"
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

          <div className="relative overflow-hidden" style={{ height: VIEW_H }}>
            <div className="bg-gray7 pointer-events-none absolute inset-x-2 top-1/2 z-0 h-12 -translate-y-1/2 rounded-lg" />
            <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-0">
              <WheelPicker items={hours} value={hour} onChangeAction={setHour} side="left" />

              <div className="text-heading relative z-20 flex h-full items-center justify-center px-4 leading-none font-bold text-black">
                :
              </div>

              <WheelPicker items={minutes} value={minute} onChangeAction={setMinute} side="right" />
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-2 gap-3 py-2">
            <button
              type="button"
              onClick={onCloseAction}
              className="text-bodySm border-gray2 text-gray6 min-h-11 cursor-pointer rounded-xl border bg-white px-4 font-semibold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => onConfirmAction(`${hour}:${minute}`)}
              className="text-bodySm bg-primary min-h-11 cursor-pointer rounded-xl px-4 font-semibold text-white"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
