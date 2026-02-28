'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function MiniCalendar() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(() => ymd(today));

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const arr: Array<{ date: number | null; key: string }> = [];
    for (let i = 0; i < startWeekday; i++) arr.push({ date: null, key: `e-${i}` });
    for (let d = 1; d <= lastDate; d++) arr.push({ date: d, key: `d-${d}` });
    return arr;
  }, [startWeekday, lastDate]);

  const onPrev = () => setView((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const onNext = () => setView((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));

  const monthText = `${month + 1}월`;

  return (
    <section className="border-gray2 flex h-full flex-col rounded-2xl border bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-normal font-semibold text-black">일정</div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="hover:bg-gray1 inline-flex h-8 w-8 items-center justify-center rounded-full"
            aria-label="이전 달"
          >
            <ChevronLeft className="text-gray6 h-4 w-4 cursor-pointer" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="hover:bg-gray1 inline-flex h-8 w-8 items-center justify-center rounded-full"
            aria-label="다음 달"
          >
            <ChevronRight className="text-gray6 h-4 w-4 cursor-pointer" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="text-small w-6 font-semibold text-black">{monthText}</div>

        <div className="text-gray5 text-small grid flex-1 grid-cols-7 text-center font-semibold">
          {WEEK.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-start gap-2">
        <div className="w-6" />

        <div className="grid flex-1 grid-cols-7 gap-y-1 text-center">
          {cells.map((c) => {
            if (c.date == null) return <div key={c.key} />;

            const dateObj = new Date(year, month, c.date);
            const key = ymd(dateObj);

            const isToday = key === ymd(today);
            const isSelected = key === selected;

            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(key)}
                className={[
                  'mx-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[12px] font-semibold',
                  isSelected ? 'bg-primary text-white' : 'text-black',
                  !isSelected && isToday ? 'ring-primary/40 ring-2' : '',
                ].join(' ')}
                aria-label={`${month + 1}월 ${c.date}일`}
              >
                {c.date}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
