import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react';

import {
  dateColorClass,
  memberScheduleTone,
  officialScheduleTone,
  weekColorClass,
} from '@/features/schedule/lib/color';
import { WEEK_LABELS, type MonthlyCalendarCell } from '@/features/schedule/lib/calendar';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { toDateKey } from '@/utils/date';
import type { TabId } from './ScheduleTabs';

type ScheduleCalendarProps = {
  cells: MonthlyCalendarCell[];
  currentMonth: string;
  onCreateAction: () => void;
  onMoveMonthAction: (delta: number) => void;
  onSelectAction: (key: string) => void;
  onTodayAction: () => void;
  scheduleMap: Record<string, Schedule[]>;
  schedules: Schedule[];
  selected: string;
  tab: TabId;
  today: Date;
};

function rangeText(schedule: Schedule) {
  const [startYear, startMonth, startDay] = schedule.startDateKey.split('-').map(Number);
  const [endYear, endMonth, endDay] = schedule.endDateKey.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);
  const startWeek = WEEK_LABELS[startDate.getDay()];
  const endWeek = WEEK_LABELS[endDate.getDay()];

  if (schedule.startDateKey === schedule.endDateKey) {
    return '';
  }

  return `${startMonth}.${startDay} (${startWeek}) - ${endMonth}.${endDay} (${endWeek})`;
}

function buildWeekRangeSegments(
  cells: MonthlyCalendarCell[],
  schedules: Schedule[],
  styleOf: (schedule: Schedule) => string,
) {
  const indexMap = new Map(cells.map((cell, index) => [cell.key, index]));
  const firstKey = cells[0]?.key;
  const lastKey = cells[cells.length - 1]?.key;

  if (!firstKey || !lastKey) {
    return [];
  }

  const laneMap = new Map<number, number[]>();

  return schedules.flatMap((schedule) => {
    if (schedule.endDateKey < firstKey || schedule.startDateKey > lastKey) {
      return [];
    }

    const visibleStart = schedule.startDateKey < firstKey ? firstKey : schedule.startDateKey;
    const visibleEnd = schedule.endDateKey > lastKey ? lastKey : schedule.endDateKey;
    const startIndex = indexMap.get(visibleStart);
    const endIndex = indexMap.get(visibleEnd);

    if (startIndex == null || endIndex == null) {
      return [];
    }

    const row = Math.floor(startIndex / 7);
    const rowEnd = row * 7 + 6;
    const segmentEnd = Math.min(endIndex, rowEnd);
    const startCol = startIndex % 7;
    const endCol = segmentEnd % 7;
    const lanes = laneMap.get(row) ?? [];
    let lane = lanes.findIndex((lastEndCol) => startCol > lastEndCol);

    if (lane === -1) {
      lane = lanes.length;
      lanes.push(endCol);
    } else {
      lanes[lane] = endCol;
    }

    laneMap.set(row, lanes);

    return [
      {
        row,
        lane,
        startCol,
        endCol,
        label: schedule.title,
        range: rangeText(schedule),
        showText: true,
        style: styleOf(schedule),
      },
    ];
  });
}

function buildOfficialSegments(cells: MonthlyCalendarCell[], schedules: Schedule[]) {
  return buildWeekRangeSegments(cells, schedules, officialScheduleTone);
}

function buildLaneOffsetMap(
  cells: MonthlyCalendarCell[],
  segments: Array<{ endCol: number; lane: number; row: number; startCol: number }>,
) {
  const map: Record<string, number> = {};

  segments.forEach((segment) => {
    for (let col = segment.startCol; col <= segment.endCol; col++) {
      const cell = cells[segment.row * 7 + col];

      if (!cell) continue;

      const count = segment.lane + 1;
      map[cell.key] = Math.max(map[cell.key] ?? 0, count);
    }
  });

  return map;
}

function getDateLabel(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getScheduleCountText(count: number) {
  if (count === 0) {
    return '일정 없음';
  }

  return `일정 ${count}개`;
}

export default function ScheduleCalendar({
  cells,
  currentMonth,
  onCreateAction,
  onMoveMonthAction,
  onSelectAction,
  onTodayAction,
  scheduleMap,
  schedules,
  selected,
  tab,
  today,
}: ScheduleCalendarProps) {
  const officialSegments =
    tab === 'OFFICIAL'
      ? buildOfficialSegments(
          cells,
          schedules.filter((schedule) => schedule.startDateKey !== schedule.endDateKey),
        )
      : [];
  const memberRangeSegments =
    tab === 'MEMBER'
      ? buildWeekRangeSegments(
          cells,
          schedules.filter((schedule) => schedule.startDateKey !== schedule.endDateKey),
          memberScheduleTone,
        )
      : [];
  const dayBox = 'absolute top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 sm:top-4';
  const memberBarBox = 'absolute left-0.5 right-0.5 top-9 bottom-0 sm:left-1 sm:right-1 sm:top-12';
  const extraBox =
    'text-gray5 text-caption pointer-events-none absolute right-2 bottom-1 text-right leading-none font-semibold';
  const officialLaneOffsetMap = buildLaneOffsetMap(cells, officialSegments);
  const memberLaneOffsetMap = buildLaneOffsetMap(cells, memberRangeSegments);

  return (
    <section className="py-2 sm:px-7 sm:py-6" aria-label={`${currentMonth} 일정 달력`}>
      <div className="border-gray2 md:hidden">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onMoveMonthAction(-1)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition"
            aria-label="이전 달"
          >
            <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <h2 className="text-body text-center font-bold text-black">{currentMonth}</h2>

          <button
            type="button"
            onClick={() => onMoveMonthAction(1)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition"
            aria-label="다음 달"
          >
            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-gray2 hidden flex-col gap-3 pb-4 md:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-center gap-4 lg:w-auto">
          <button
            type="button"
            onClick={() => onMoveMonthAction(-1)}
            className="sm:border-gray2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition sm:border"
            aria-label="이전 달"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <h2 className="text-body sm:text-title text-center font-bold text-black">
            {currentMonth}
          </h2>
          <button
            type="button"
            onClick={() => onMoveMonthAction(1)}
            className="sm:border-gray2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition sm:border"
            aria-label="다음 달"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
          {tab === 'MEMBER' ? (
            <button
              type="button"
              onClick={onCreateAction}
              className="border-primary/20 bg-primary/5 text-primary-foreground text-bodySm inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 font-semibold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              일정 추가
            </button>
          ) : null}
          <button
            type="button"
            onClick={onTodayAction}
            className="border-gray2 text-gray6 text-bodySm inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 font-semibold transition"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            오늘 날짜로 이동
          </button>
        </div>
      </div>

      <div className="mt-2">
        <div
          className="text-body grid grid-cols-7 gap-2 pb-2 text-center font-semibold"
          aria-hidden="true"
        >
          {WEEK_LABELS.map((week, index) => (
            <div key={week} className={weekColorClass(index)}>
              {week}
            </div>
          ))}
        </div>

        <div className="sm:border-gray2 auto-rows-28 sm:auto-rows-35 relative grid grid-cols-7 overflow-hidden rounded-lg bg-white [--bar-gap:0.25rem] [--bar-step:1.25rem] sm:rounded-2xl sm:border sm:[--bar-gap:0.375rem] sm:[--bar-step:1.625rem]">
          {tab === 'OFFICIAL' || memberRangeSegments.length > 0 ? (
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-7 grid-rows-6">
              {(tab === 'OFFICIAL' ? officialSegments : memberRangeSegments).map(
                (segment, index) => (
                  <div
                    key={`${segment.label}-${segment.row}-${segment.startCol}-${segment.endCol}-${index}`}
                    className="px-0.5 sm:px-1"
                    style={{
                      gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`,
                      gridRow: `${segment.row + 1}`,
                    }}
                  >
                    <div
                      className={[
                        'text-caption mt-9 flex h-4 items-center rounded-full px-1.5 font-semibold sm:mt-12 sm:h-5 sm:px-2.5',
                        segment.style,
                      ].join(' ')}
                      style={{
                        transform: `translateY(calc(var(--bar-step) * ${segment.lane}))`,
                      }}
                    >
                      {segment.showText ? <span className="truncate">{segment.label}</span> : null}
                      {segment.showText && segment.range ? (
                        <span className="ml-auto hidden truncate pl-2 sm:block">
                          {segment.range}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : null}

          {cells.map((cell, index) => {
            const key = toDateKey(cell.date);
            const day = cell.date.getDate();
            const dailySchedules = (scheduleMap[key] ?? []).filter(
              (schedule) => schedule.startDateKey === schedule.endDateKey,
            );
            const occupiedLaneCount =
              tab === 'OFFICIAL'
                ? (officialLaneOffsetMap[key] ?? 0)
                : (memberLaneOffsetMap[key] ?? 0);
            const visibleCount = Math.max(3 - occupiedLaneCount, 0);
            const visible = dailySchedules.slice(0, visibleCount);
            const extra = Math.max(dailySchedules.length - visible.length, 0);
            const isSelected = key === selected;
            const isToday = key === toDateKey(today);
            const textColor = dateColorClass(cell.date, cell.inMonth);
            const scheduleCount = (scheduleMap[key] ?? []).length;
            const dateLabel = getDateLabel(cell.date);

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onSelectAction(key)}
                className={[
                  'sm:border-gray2 relative z-0 h-28 cursor-pointer text-left transition sm:h-35 sm:border-r sm:border-b',
                  index % 7 === 6 ? 'sm:border-r-0' : '',
                  index >= 35 ? 'sm:border-b-0' : '',
                  isSelected ? 'bg-primary/5' : '',
                ].join(' ')}
                aria-label={`${dateLabel}, ${getScheduleCountText(scheduleCount)}`}
                aria-pressed={isSelected}
                aria-current={isToday ? 'date' : undefined}
              >
                <div className={dayBox}>
                  <span
                    className={[
                      'sm:text-caption text-caption inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold',
                      textColor,
                      isSelected ? 'bg-primary text-white' : '',
                      !isSelected && isToday ? 'ring-primary/25 ring-2' : '',
                    ].join(' ')}
                  >
                    {day}
                  </span>
                </div>

                {tab === 'MEMBER' ? (
                  <>
                    <div
                      className={[memberBarBox, 'pointer-events-none'].join(' ')}
                      style={{
                        transform: `translateY(calc(var(--bar-step) * ${memberLaneOffsetMap[key] ?? 0}))`,
                      }}
                    >
                      <div className="flex flex-col gap-[var(--bar-gap)]">
                        {visible.map((schedule, barIndex) => (
                          <div
                            key={`${schedule.title}-${schedule.startAt}-${barIndex}`}
                            className={[
                              'text-caption flex h-4 items-center rounded-full px-1.5 leading-3 font-medium sm:h-5 sm:px-2.5 sm:font-semibold',
                              cell.inMonth
                                ? memberScheduleTone(schedule)
                                : 'bg-gray7 text-schedule-muted',
                            ].join(' ')}
                          >
                            <span className="truncate">{schedule.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {extra > 0 ? <div className={extraBox}>+{extra}</div> : null}
                  </>
                ) : tab === 'OFFICIAL' ? (
                  <>
                    <div
                      className={[memberBarBox, 'pointer-events-none'].join(' ')}
                      style={{
                        transform: `translateY(calc(var(--bar-step) * ${officialLaneOffsetMap[key] ?? 0}))`,
                      }}
                    >
                      <div className="flex flex-col gap-[var(--bar-gap)]">
                        {visible.map((schedule, barIndex) => (
                          <div
                            key={`${schedule.title}-${schedule.startAt}-${barIndex}`}
                            className={[
                              'text-caption flex h-4 items-center rounded-full px-1.5 leading-3 font-semibold sm:h-5 sm:px-2.5',
                              cell.inMonth
                                ? officialScheduleTone(schedule)
                                : 'bg-gray7 text-schedule-muted',
                            ].join(' ')}
                          >
                            <span className="truncate">{schedule.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {extra > 0 ? <div className={extraBox}>+{extra}</div> : null}
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
