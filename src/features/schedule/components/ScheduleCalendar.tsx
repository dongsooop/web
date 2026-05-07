import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { memberScheduleTone, officialScheduleTone } from '@/features/schedule/lib/color';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { WEEK_LABELS, type MonthlyCalendarCell } from '@/features/schedule/lib/calendar';
import { toDateKey } from '@/utils/date';

type ScheduleCalendarProps = {
  cells: MonthlyCalendarCell[];
  currentMonth: string;
  selected: string;
  schedules: Schedule[];
  scheduleMap: Record<string, Schedule[]>;
  tab: 'MEMBER' | 'OFFICIAL';
  today: Date;
  onSelect: (key: string, inMonth: boolean, date: Date) => void;
  onMoveMonth: (delta: number) => void;
  onToday: () => void;
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

export default function ScheduleCalendar({
  cells,
  currentMonth,
  selected,
  schedules,
  scheduleMap,
  tab,
  today,
  onSelect,
  onMoveMonth,
  onToday,
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
  const dayBox = 'absolute top-2 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 sm:top-4';
  const memberContentBox =
    'absolute left-1.5 right-1.5 top-8 bottom-1.5 sm:left-4 sm:right-4 sm:top-12 sm:bottom-4';
  const officialLaneOffsetMap = buildLaneOffsetMap(cells, officialSegments);

  return (
    <div className="py-4 sm:px-7 sm:py-6">
      <div className="border-gray2 relative flex items-center justify-between pb-4">
        <div className="grid w-full grid-cols-[2.25rem_minmax(7.5rem,max-content)_2.25rem] items-center justify-center gap-4 sm:w-auto sm:grid-cols-[2.5rem_minmax(8.25rem,max-content)_2.5rem]">
          <button
            type="button"
            onClick={() => onMoveMonth(-1)}
            className="hover:bg-gray7 sm:border-gray2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition sm:border"
            aria-label="이전 달"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-normal sm:text-title text-center font-bold text-black">
            {currentMonth}
          </div>
          <button
            type="button"
            onClick={() => onMoveMonth(1)}
            className="hover:bg-gray7 sm:border-gray2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-black transition sm:border"
            aria-label="다음 달"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden items-center gap-2 sm:absolute sm:top-0 sm:right-0 sm:flex">
          {tab === 'MEMBER' ? (
            <button
              type="button"
              disabled
              className="border-primary/20 bg-primary/5 text-primary-foreground inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 text-sm font-semibold"
              aria-label="일정 추가 준비 중"
            >
              <Plus className="h-4 w-4" />
              일정 추가
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToday}
            className="border-gray2 text-gray6 hover:bg-gray7 inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition"
          >
            <CalendarDays className="h-4 w-4" />
            오늘 날짜로 이동
          </button>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-normal grid grid-cols-7 gap-2 pb-2 text-center font-semibold">
          {WEEK_LABELS.map((week, index) => (
            <div
              key={week}
              className={
                index === 0 ? 'text-schedule-sunday' : index === 6 ? 'text-primary' : 'text-black'
              }
            >
              {week}
            </div>
          ))}
        </div>

        <div className="sm:border-gray2 auto-rows-24 sm:auto-rows-35 relative grid grid-cols-7 overflow-hidden rounded-lg bg-white [--bar-gap:0.125rem] [--bar-step:1.125rem] sm:rounded-2xl sm:border sm:[--bar-gap:0.25rem] sm:[--bar-step:1.5rem]">
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
                        'mt-8 flex h-4 items-center rounded-full px-1.5 text-xs font-semibold sm:mt-12 sm:h-5 sm:px-2.5',
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
            const visible = dailySchedules.slice(0, 3);
            const extra = Math.max(dailySchedules.length - visible.length, 0);
            const isSelected = key === selected;
            const isToday = key === toDateKey(today);
            const textColor = !cell.inMonth
              ? 'text-schedule-muted'
              : index % 7 === 0
                ? 'text-schedule-sunday'
                : index % 7 === 6
                  ? 'text-primary'
                  : 'text-black';

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onSelect(key, cell.inMonth, cell.date)}
                className={[
                  'sm:border-gray2 relative z-0 h-24 cursor-pointer text-left transition sm:h-35 sm:border-r sm:border-b',
                  index % 7 === 6 ? 'sm:border-r-0' : '',
                  index >= 35 ? 'sm:border-b-0' : '',
                  isSelected ? 'bg-primary/5' : 'hover:bg-gray7/60',
                ].join(' ')}
                aria-label={`${cell.date.getMonth() + 1}월 ${day}일`}
              >
                <div className={dayBox}>
                  <span
                    className={[
                      'sm:text-small inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8',
                      textColor,
                      isSelected ? 'bg-primary text-white' : '',
                      !isSelected && isToday ? 'ring-primary/25 ring-2' : '',
                    ].join(' ')}
                  >
                    {day}
                  </span>
                </div>

                {tab === 'MEMBER' ? (
                  <div
                    className={[memberContentBox, 'pointer-events-none flex flex-col'].join(' ')}
                  >
                    <div className="flex flex-col gap-1">
                      {visible.map((schedule, barIndex) => (
                        <div
                          key={`${schedule.title}-${schedule.startAt}-${barIndex}`}
                          className={[
                            'flex h-4 items-center rounded-full px-1.5 text-xs leading-3 font-medium sm:h-5 sm:px-2.5 sm:font-semibold',
                            cell.inMonth
                              ? memberScheduleTone(schedule)
                              : 'bg-gray7 text-schedule-muted',
                          ].join(' ')}
                        >
                          <span className="truncate">{schedule.title}</span>
                        </div>
                      ))}
                    </div>
                    {extra > 0 ? (
                      <div className="text-gray5 sm:text-small mt-auto text-right text-xs font-semibold">
                        +{extra}
                      </div>
                    ) : null}
                  </div>
                ) : tab === 'OFFICIAL' ? (
                  <div
                    className={[memberContentBox, 'pointer-events-none flex flex-col'].join(' ')}
                    style={{
                      transform: `translateY(calc(var(--bar-step) * ${officialLaneOffsetMap[key] ?? 0}))`,
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      {visible.map((schedule, barIndex) => (
                        <div
                          key={`${schedule.title}-${schedule.startAt}-${barIndex}`}
                          className={[
                            'flex h-4 items-center rounded-full px-1.5 text-xs leading-3 font-semibold sm:h-5 sm:px-2.5 sm:leading-4',
                            cell.inMonth
                              ? officialScheduleTone(schedule)
                              : 'bg-gray7 text-schedule-muted',
                          ].join(' ')}
                        >
                          <div className="truncate">{schedule.title}</div>
                        </div>
                      ))}
                    </div>
                    {extra > 0 ? (
                      <div className="text-gray5 sm:text-small mt-auto text-right text-xs leading-3 font-semibold sm:leading-4">
                        +{extra}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
