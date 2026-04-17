'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import {
  buildCalendarCells,
  formatScheduleTimeLabel,
  getVisibleSchedules,
  shiftCalendarMonth,
  WEEK_LABELS,
} from '@/features/schedule/lib/calendar';
import { toDateKey, toMonthKey } from '@/features/schedule/lib/date';
import { formatDateLabel, formatMonthLabel } from '@/utils/formatter/date';

export default function MiniCalendar() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(() => toDateKey(today));
  const monthKey = toMonthKey(view);
  const { data, isLoading, isError, displayErrorMessage } = useScheduleQuery(monthKey);

  const year = view.getFullYear();
  const month = view.getMonth();
  const cells = useMemo(() => buildCalendarCells(view), [view]);
  const monthText = formatMonthLabel(view);
  const { visibleSchedules, overflowCount } = useMemo(
    () => getVisibleSchedules(data ?? [], selected),
    [data, selected],
  );

  const handleMoveMonth = (delta: number) => {
    const nextState = shiftCalendarMonth(view, selected, delta);
    setView(nextState.view);
    setSelected(nextState.selectedDateKey);
  };

  return (
    <section className="border-gray2 flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-normal font-semibold text-black">일정</div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleMoveMonth(-1)}
            className="hover:bg-gray1 inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-label="이전 달"
          >
            <ChevronLeft className="text-gray6 h-4 w-4 cursor-pointer" />
          </button>
          <button
            type="button"
            onClick={() => handleMoveMonth(1)}
            className="hover:bg-gray1 inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-label="다음 달"
          >
            <ChevronRight className="text-gray6 h-4 w-4 cursor-pointer" />
          </button>
        </div>
      </div>

      <div className="mt-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-small w-6 font-semibold text-black">{monthText}</div>

          <div className="text-gray5 text-small grid flex-1 grid-cols-7 text-center font-semibold">
            {WEEK_LABELS.map((w) => (
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
              const key = toDateKey(dateObj);

              const isToday = key === toDateKey(today);
              const isSelected = key === selected;

              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={[
                    'mx-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[12px] font-semibold',
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
      </div>

      <div className="mt-1 flex min-h-0 flex-col pt-4">
        <div className="border-gray2 mb-4 h-px w-full shrink-0 border-t" aria-hidden="true" />
        <div className="shrink-0 px-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-small font-semibold text-black">
              {formatDateLabel(selected)} 일정
            </div>
            {overflowCount > 0 ? (
              <div className="text-small text-gray5 shrink-0 font-semibold">+{overflowCount}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 min-h-11 px-1">
          {isError ? (
            <div className="text-small text-gray5 flex min-h-11 items-center justify-center text-center">
              {displayErrorMessage}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-gray2 bg-gray1 min-h-11 animate-pulse rounded-xl border"
                />
              ))}
            </div>
          ) : visibleSchedules.length > 0 ? (
            <div className="grid h-14 grid-cols-3 gap-2">
              {visibleSchedules.map((schedule, index) => (
                <div
                  key={`${schedule.title}-${schedule.dateKey}-${schedule.startAt}-${index}`}
                  className="border-gray2 flex min-w-0 flex-col justify-center rounded-xl border bg-white px-3"
                >
                  <div className="min-w-0">
                    <div className="text-small truncate font-semibold text-black">
                      {schedule.title}
                    </div>
                    <div className="text-small text-gray5 mt-0.5 truncate">
                      {formatScheduleTimeLabel(schedule)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small text-gray5 flex min-h-11 items-center justify-center text-center">
              선택한 날짜에 예정된 일정이 없어요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
