'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import {
  buildMonthlyCalendarCells,
  groupSchedulesByDate,
  sortSchedules,
} from '@/features/schedule/lib/calendar';
import { formatDateWithDayLabel, formatMonthLabel, toDateKey, toMonthKey } from '@/utils/date';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleDetail from './ScheduleDetail';
import ScheduleTabs from './ScheduleTabs';

const tabs = [
  { id: 'MEMBER', label: '개인 일정' },
  { id: 'OFFICIAL', label: '학사 일정' },
] as const;

type TabId = (typeof tabs)[number]['id'];

function descriptionText() {
  return '학사 일정과 개인 일정을 확인하고 관리할 수 있어요.';
}

export default function ScheduleBoard() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(() => toDateKey(today));
  const [tab, setTab] = useState<TabId>('MEMBER');
  const monthKey = toMonthKey(view);
  const { data, isLoading, isError, displayErrorMessage } = useScheduleQuery(monthKey);
  const source = useMemo(() => data ?? [], [data]);

  const list = useMemo(
    () => sortSchedules(source.filter((schedule) => schedule.type === tab)),
    [source, tab],
  );
  const map = useMemo(() => groupSchedulesByDate(list), [list]);
  const cells = useMemo(() => buildMonthlyCalendarCells(view), [view]);
  const selectedList = map[selected] ?? [];
  const selectedDay = formatDateWithDayLabel(selected);
  const currentMonth = `${view.getFullYear()}년 ${formatMonthLabel(view)}`;

  const moveMonth = (delta: number) => {
    const next = new Date(view.getFullYear(), view.getMonth() + delta, 1);
    const lastDate = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    const day = Number(selected.slice(8, 10)) || 1;
    const nextSelected = new Date(next.getFullYear(), next.getMonth(), Math.min(day, lastDate));

    setView(next);
    setSelected(toDateKey(nextSelected));
  };

  const moveToday = () => {
    const next = new Date(today.getFullYear(), today.getMonth(), 1);
    setView(next);
    setSelected(toDateKey(today));
  };

  const selectDate = (key: string, inMonth: boolean, date: Date) => {
    setSelected(key);
    if (!inMonth) {
      setView(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto flex w-full max-w-layout flex-col gap-4 px-0 py-0 sm:px-4 sm:py-4">
        <div className="px-1 sm:px-0">
          <PageHeader title="일정" description={descriptionText()} />
        </div>

        <section className="sm:border-gray2 overflow-hidden rounded-panel bg-white sm:border sm:shadow-schedule-panel">
          <div className="border-gray2 flex border-b px-4 pt-3 sm:px-7 sm:pt-5">
            <div className="text-small border-primary text-primary flex flex-1 items-center justify-center border-b-2 px-2 pb-3 font-semibold sm:flex-none sm:justify-start sm:px-3 sm:pb-4 sm:text-normal">
              개인 일정
            </div>
            <div className="text-small text-gray5 flex flex-1 items-center justify-center border-b-2 border-transparent px-2 pb-3 font-semibold sm:flex-none sm:justify-start sm:px-3 sm:pb-4 sm:text-normal">
              학사 일정
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-schedule">
            <div className="px-4 py-4 sm:px-7 sm:py-6">
              <div className="bg-gray7 h-90 animate-pulse rounded-card sm:h-130" />
            </div>
            <div className="border-gray2 border-t px-4 py-4 sm:px-6 sm:py-6 lg:border-t-0 lg:border-l">
              <div className="bg-gray7 h-65 animate-pulse rounded-card" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-layout flex-col gap-4 px-0 py-0 sm:px-4 sm:py-4">
      <div className="px-1 sm:px-0">
        <PageHeader title="일정" description={descriptionText()} />
      </div>

      <section className="sm:border-gray2 overflow-hidden rounded-panel bg-white sm:border sm:shadow-schedule-panel">
        <ScheduleTabs tab={tab} items={tabs} onChange={setTab} />

        <div className="grid gap-0 lg:grid-cols-schedule">
          <ScheduleCalendar
            cells={cells}
            currentMonth={currentMonth}
            selected={selected}
            schedules={list}
            scheduleMap={map}
            tab={tab}
            today={today}
            onSelect={selectDate}
            onMoveMonth={moveMonth}
            onToday={moveToday}
          />

          <ScheduleDetail
            tab={tab}
            selectedDay={selectedDay}
            selectedList={selectedList}
            isLoading={isLoading}
            isError={isError}
            displayErrorMessage={displayErrorMessage}
          />
        </div>
      </section>
    </div>
  );
}
