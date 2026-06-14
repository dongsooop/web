'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { WHEEL_CONTENT_PAD, WHEEL_LOOP_COUNT, WHEEL_ROW_H, type WheelItem } from './utils';

type WheelProps = {
  items: WheelItem[];
  value: string;
  loop?: boolean;
  widthClassName?: string;
  onChangeAction: (value: string) => void;
};

const toneMap = [
  { className: 'text-body font-medium text-black', opacity: 0.96 },
  { className: 'text-bodySm font-medium text-gray6', opacity: 0.72 },
  { className: 'text-caption font-medium text-gray5', opacity: 0.52 },
  { className: 'text-caption font-normal text-gray4', opacity: 0.4 },
] as const;

export default function DateTimeWheel({
  items,
  value,
  loop = false,
  widthClassName = '',
  onChangeAction,
}: WheelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const repeatedItems = useMemo(
    () =>
      loop
        ? Array.from({ length: WHEEL_LOOP_COUNT }, (_, loopIndex) =>
            items.map((item) => ({
              ...item,
              key: `${loopIndex}-${item.key}`,
            })),
          ).flat()
        : items,
    [items, loop],
  );

  const initialIndex = useMemo(
    () =>
      Math.max(
        items.findIndex((item) => item.value === value),
        0,
      ),
    [items, value],
  );

  const middleLoop = Math.floor(WHEEL_LOOP_COUNT / 2);
  const centerIndex = loop ? middleLoop * items.length + initialIndex : initialIndex;
  const [focusIndex, setFocusIndex] = useState(centerIndex);

  const alignMiddle = (index: number) => {
    const node = ref.current;

    if (!node) return;

    node.scrollTop = index * WHEEL_ROW_H;
  };

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    alignMiddle(centerIndex);
  }, [centerIndex]);

  const setNextFocus = (nextIndex: number) => {
    setFocusIndex((prev) => (prev === nextIndex ? prev : nextIndex));
  };

  const syncValue = () => {
    const node = ref.current;

    if (!node) return;

    const index = Math.round(node.scrollTop / WHEEL_ROW_H);
    const cycleSize = items.length;
    const normalized = loop ? ((index % cycleSize) + cycleSize) % cycleSize : index;
    const safeIndex = loop ? normalized : Math.min(Math.max(normalized, 0), cycleSize - 1);
    const next = items[safeIndex];

    if (next && next.value !== value) {
      onChangeAction(next.value);
    }

    if (loop) {
      const cycle = Math.floor(index / cycleSize);
      let nextIndex = index;

      if (cycle < 2 || cycle > WHEEL_LOOP_COUNT - 3) {
        nextIndex = middleLoop * cycleSize + normalized;
        alignMiddle(nextIndex);
      }

      setNextFocus(nextIndex);
      return;
    }

    setNextFocus(safeIndex);
  };

  return (
    <div className={['relative z-10 h-full overflow-hidden', widthClassName].join(' ')}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/60 to-white/0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/60 to-white/0" />

      <div
        ref={ref}
        className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: WHEEL_CONTENT_PAD, paddingBottom: WHEEL_CONTENT_PAD }}
        onScroll={syncValue}
      >
        <div aria-hidden="true" />
        <div aria-hidden="true" />

        {repeatedItems.map((item, index) => {
          const distance = Math.abs(index - focusIndex);
          const tone = toneMap[distance > 3 ? 3 : distance];

          return (
            <button
              key={item.key}
              type="button"
              onClick={(e) => {
                const node = ref.current;

                if (node) {
                  node.scrollTo({
                    top: e.currentTarget.offsetTop - WHEEL_CONTENT_PAD,
                    behavior: 'smooth',
                  });
                }

                setNextFocus(index);
                onChangeAction(item.value);
              }}
              className={[
                'relative z-30 flex h-12 w-full cursor-pointer snap-center items-center justify-center px-2 leading-none transition',
                tone.className,
              ].join(' ')}
              style={{ opacity: tone.opacity }}
            >
              <span className="truncate text-center">{item.label}</span>
            </button>
          );
        })}

        <div aria-hidden="true" />
        <div aria-hidden="true" />
      </div>
    </div>
  );
}
