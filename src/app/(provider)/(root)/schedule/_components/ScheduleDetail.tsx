import { CalendarDays, MapPin, PlusCircle, X } from 'lucide-react';

import { scheduleLineColor } from '@/features/schedule/lib/color';
import type { Schedule } from '@/features/schedule/types/ui-model';

type ScheduleDetailProps = {
  tab: 'MEMBER' | 'OFFICIAL';
  selectedDay: string;
  selectedList: Schedule[];
  isError: boolean;
  displayErrorMessage: string | null;
  mode?: 'panel' | 'sheet';
  onCloseAction?: () => void;
  onCreateAction?: () => void;
};

function emptyText(tab: 'MEMBER' | 'OFFICIAL') {
  return tab === 'MEMBER' ? '등록된 일정이 없어요.' : '등록된 학사 일정이 없어요.';
}

function helperText(tab: 'MEMBER' | 'OFFICIAL') {
  return tab === 'MEMBER' ? '선택한 날짜의 개인 일정이에요.' : '선택한 날짜의 학사 일정이에요.';
}

function shortDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const week = ['일', '월', '화', '수', '목', '금', '토'][new Date(year, month - 1, day).getDay()];
  return `${month}.${day} (${week})`;
}

function dateText(schedule: Schedule) {
  if (schedule.startDateKey !== schedule.endDateKey) {
    return `${shortDateLabel(schedule.startDateKey)} - ${shortDateLabel(schedule.endDateKey)}`;
  }

  return shortDateLabel(schedule.startDateKey);
}

function timeText(schedule: Schedule, tab: 'MEMBER' | 'OFFICIAL') {
  if (tab === 'OFFICIAL') {
    return '';
  }

  if (schedule.startAt === '00:00' && schedule.endAt === '23:59') {
    return '종일';
  }

  return `${schedule.startAt} - ${schedule.endAt}`;
}

export default function ScheduleDetail({
  tab,
  selectedDay,
  selectedList,
  isError,
  displayErrorMessage,
  mode = 'panel',
  onCloseAction,
  onCreateAction,
}: ScheduleDetailProps) {
  const panelClass =
    mode === 'sheet'
      ? 'border-gray2 flex max-h-80 flex-col overflow-hidden border-t bg-white'
      : 'border-gray2 border-t bg-white p-4 sm:p-6 lg:border-t-0';

  return (
    <aside className={panelClass}>
      <div
        className={[
          'flex shrink-0 items-center justify-between bg-white',
          mode === 'sheet' ? 'px-4' : '',
        ].join(' ')}
      >
        <div>
          <div className="text-bodySm sm:text-heading font-regular text-black">{selectedDay}</div>

          <p className="text-gray5 text-bodySm mt-1 hidden md:block">{helperText(tab)}</p>
        </div>

        {mode === 'sheet' && onCloseAction ? (
          <button
            type="button"
            onClick={onCloseAction}
            className="text-gray5 inline-flex h-11 w-6 cursor-pointer items-center justify-center bg-white"
            aria-label="상세 일정 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div
        className={[
          'min-h-0 flex-1 overflow-y-auto bg-white',
          mode === 'sheet' ? 'px-4 py-3' : 'sm:mt-9',
        ].join(' ')}
      >
        <div className="flex flex-col gap-3">
          {isError ? (
            <div className="border-warning/10 bg-warning/10 text-warning text-bodySm rounded-2xl border px-4 py-5">
              {displayErrorMessage}
            </div>
          ) : selectedList.length > 0 ? (
            selectedList.map((schedule, index) => (
              <article
                key={`${schedule.title}-${schedule.startAt}-${index}`}
                className="border-gray2 shadow-schedule-card flex min-h-11 cursor-pointer gap-3.5 rounded-2xl border bg-white p-3"
              >
                <div
                  className={['mt-0.5 w-1 shrink-0 rounded-full', scheduleLineColor(schedule)].join(
                    ' ',
                  )}
                />

                <div className="min-w-0 flex-1">
                  <div className="text-caption text-gray6 font-regular flex items-center justify-between gap-3">
                    <span className="truncate">{dateText(schedule)}</span>

                    {timeText(schedule, tab) ? (
                      <span className="shrink-0">{timeText(schedule, tab)}</span>
                    ) : null}
                  </div>

                  <div className="sm:text-body text-bodySm mt-1 font-semibold text-black">
                    {schedule.title}
                  </div>

                  {schedule.location ? (
                    <div className="text-caption text-gray5 mt-2 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="text-gray5 text-bodySm flex min-h-16 items-center justify-center bg-white text-center">
              {emptyText(tab)}
            </div>
          )}
        </div>
      </div>

      {mode === 'sheet' && tab === 'MEMBER' && onCreateAction ? (
        <div className="border-gray2 shrink-0 border-t bg-white px-4">
          <button
            type="button"
            onClick={onCreateAction}
            className="text-gray6 text-bodySm inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-white font-semibold"
          >
            <PlusCircle className="h-5 w-5" />
            일정 추가하기
          </button>
        </div>
      ) : null}
    </aside>
  );
}
