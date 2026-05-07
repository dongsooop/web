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
import ScheduleSkeleton from './ScheduleSkeleton';
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
  const showSkeleton = !mounted || isLoading;

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

  if (showSkeleton) {
    return (
      <div className="max-w-layout mx-auto flex w-full flex-col gap-4 sm:px-4">
        <div className="px-1">
          <PageHeader title="일정" description={descriptionText()} />
        </div>

        <ScheduleSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-layout mx-auto flex w-full flex-col gap-4 sm:px-4">
      <div className="px-1">
        <PageHeader title="일정" description={descriptionText()} />
      </div>

      <section className="sm:border-gray2 sm:shadow-schedule-panel overflow-hidden rounded-2xl bg-white sm:border">
        <ScheduleTabs tab={tab} items={tabs} onChange={setTab} />

        <div className="lg:grid-cols-schedule grid gap-0">
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
            isError={isError}
            displayErrorMessage={displayErrorMessage}
          />
        </div>
      </section>
    </div>
  );
}
