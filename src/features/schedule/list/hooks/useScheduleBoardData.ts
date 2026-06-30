'use client';

import { useMemo } from 'react';

import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import {
  buildMonthlyCalendarCells,
  groupSchedulesByDate,
  sortSchedules,
} from '@/features/schedule/lib/calendar';
import { formatDateWithDayLabel, formatMonthLabel, toMonthKey } from '@/utils/date';
import type { TabId } from '../components/ScheduleTabs';

type UseScheduleBoardDataOptions = {
  mounted: boolean;
  selected: string;
  tab: TabId;
  view: Date;
};

export function useScheduleBoardData({
  mounted,
  selected,
  tab,
  view,
}: UseScheduleBoardDataOptions) {
  const monthKey = toMonthKey(view);
  const { data, isLoading, isError, isQueryReady, displayErrorMessage } =
    useScheduleQuery(monthKey);
  const source = useMemo(() => data ?? [], [data]);
  const schedules = useMemo(
    () => sortSchedules(source.filter((schedule) => schedule.type === tab)),
    [source, tab],
  );
  const scheduleMap = useMemo(() => groupSchedulesByDate(schedules), [schedules]);
  const cells = useMemo(() => buildMonthlyCalendarCells(view), [view]);
  const selectedList = useMemo(() => scheduleMap[selected] ?? [], [scheduleMap, selected]);
  const selectedDay = useMemo(() => formatDateWithDayLabel(selected), [selected]);
  const currentMonth = useMemo(
    () => `${view.getFullYear()}년 ${formatMonthLabel(view)}`,
    [view],
  );
  const showSkeleton = !mounted || (!data && (!isQueryReady || isLoading));

  return {
    cells,
    currentMonth,
    displayErrorMessage,
    isError,
    scheduleMap,
    schedules,
    selectedDay,
    selectedList,
    showSkeleton,
  };
}
