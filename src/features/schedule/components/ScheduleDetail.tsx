import { CalendarDays, MapPin, SquarePlus } from 'lucide-react';

import { scheduleLineColor } from '@/features/schedule/lib/color';
import type { Schedule } from '@/features/schedule/types/ui-model';

type ScheduleDetailProps = {
  tab: 'MEMBER' | 'OFFICIAL';
  selectedDay: string;
  selectedList: Schedule[];
  isError: boolean;
  displayErrorMessage: string | null;
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

function metaText(schedule: Schedule, tab: 'MEMBER' | 'OFFICIAL') {
  if (tab === 'OFFICIAL') {
    if (schedule.startDateKey === schedule.endDateKey) {
      return shortDateLabel(schedule.startDateKey);
    }

    return `${shortDateLabel(schedule.startDateKey)} - ${shortDateLabel(schedule.endDateKey)}`;
  }

  if (schedule.startDateKey !== schedule.endDateKey) {
    return `${shortDateLabel(schedule.startDateKey)} - ${shortDateLabel(schedule.endDateKey)}`;
  }

  return `${schedule.startAt} - ${schedule.endAt}`;
}

export default function ScheduleDetail({
  tab,
  selectedDay,
  selectedList,
  isError,
  displayErrorMessage,
}: ScheduleDetailProps) {
  return (
    <aside className="border-gray2 border-t p-4 sm:p-6 lg:border-t-0 lg:border-l">
      <div className="border-gray2 flex items-center justify-between pb-2">
        <div>
          <div className="text-normal font-bold text-black sm:text-xl">{selectedDay}</div>
          <p className="text-gray5 mt-1 hidden text-sm sm:block">{helperText(tab)}</p>
        </div>
        {tab === 'MEMBER' ? (
          <button
            type="button"
            disabled
            className="text-gray4 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full sm:hidden"
            aria-label="일정 추가 준비 중"
          >
            <SquarePlus className="h-6 w-6" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:mt-9">
        {isError ? (
          <div className="border-warning/10 bg-warning/10 text-warning rounded-2xl border px-4 py-5 text-sm">
            {displayErrorMessage}
          </div>
        ) : selectedList.length > 0 ? (
          selectedList.map((schedule, index) => (
            <article
              key={`${schedule.title}-${schedule.startAt}-${index}`}
              className="border-gray2 shadow-schedule-card flex min-h-11 cursor-pointer gap-3 rounded-2xl border bg-white px-3.5 py-3.5 sm:gap-4 sm:p-4"
            >
              <div
                className={['mt-0.5 w-1 shrink-0 rounded-full', scheduleLineColor(schedule)].join(
                  ' ',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="text-small text-gray6 font-semibold">{metaText(schedule, tab)}</div>
                <div className="sm:text-normal mt-1 text-sm font-semibold text-black">
                  {schedule.title}
                </div>
                {schedule.location ? (
                  <div className="text-small text-gray5 mt-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{schedule.location}</span>
                  </div>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="bg-gray7 flex min-h-45 flex-col items-center justify-center rounded-2xl px-6 text-center sm:min-h-60">
            <div className="shadow-schedule-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-white sm:h-16 sm:w-16">
              <CalendarDays className="text-gray5 h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="sm:text-normal mt-4 text-sm font-semibold text-black sm:mt-5">
              {emptyText(tab)}
            </div>
            <p className="text-small text-gray5 mt-2 leading-5 sm:leading-6">
              다른 날짜를 선택해서 일정을 확인해보세요.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
