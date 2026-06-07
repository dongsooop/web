import { CalendarDays, MapPin, PlusCircle } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';
import { scheduleLineColor } from '@/features/schedule/lib/color';
import type { Schedule } from '@/features/schedule/types/ui-model';
import type { TabId } from './ScheduleTabs';

type ScheduleDetailContentProps = {
  contentClassName?: string;
  displayErrorMessage: string | null;
  isError: boolean;
  listClassName?: string;
  onCreateAction?: () => void;
  onSelectScheduleAction?: (schedule: Schedule) => void;
  selectedDay: string;
  selectedList: Schedule[];
  showCreateAction?: boolean;
  showHeader?: boolean;
  tab: TabId;
};

function emptyText(tab: TabId) {
  return tab === 'MEMBER' ? '등록된 일정이 없어요.' : '등록된 학사 일정이 없어요.';
}

function helperText(tab: TabId) {
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

function timeText(schedule: Schedule, tab: TabId) {
  if (tab === 'OFFICIAL') {
    return '';
  }

  if (schedule.startAt === '00:00' && schedule.endAt === '23:59') {
    return '종일';
  }

  return `${schedule.startAt} - ${schedule.endAt}`;
}

export default function
  ScheduleDetailContent({
  contentClassName = '',
  displayErrorMessage,
  isError,
  listClassName = '',
  onCreateAction,
  onSelectScheduleAction,
  selectedDay,
  selectedList,
  showCreateAction = false,
  showHeader = true,
  tab,
}: ScheduleDetailContentProps) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white">
        <div className={['flex flex-col gap-6', contentClassName].join(' ')}>
          {showHeader ? (
            <div>
              <div className="text-heading font-semibold text-black">{selectedDay}</div>
              <p className="text-gray5 text-bodySm mt-1 hidden md:block">{helperText(tab)}</p>
            </div>
          ) : null}

          <div className={listClassName}>
            {isError ? (
              <div className="border-warning/10 bg-warning/10 text-warning text-bodySm rounded-2xl border px-4 py-5">
                {displayErrorMessage}
              </div>
            ) : selectedList.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedList.map((schedule, index) => (
                  <article
                    key={`${schedule.title}-${schedule.startAt}-${index}`}
                    onClick={() => onSelectScheduleAction?.(schedule)}
                    className={[
                      'border-gray2 shadow-schedule-card flex min-h-11 gap-3.5 rounded-2xl border bg-white p-3',
                      tab === 'MEMBER' && schedule.id !== null ? 'cursor-pointer' : '',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'mt-0.5 w-1 shrink-0 rounded-full',
                        scheduleLineColor(schedule),
                      ].join(' ')}
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
                ))}
              </div>
            ) : (
              <div className="bg-gray7 flex min-h-45 flex-col items-center justify-center rounded-2xl px-6 text-center sm:min-h-60">
                <div className="shadow-schedule-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-white sm:h-16 sm:w-16">
                  <CalendarDays className="text-gray5 h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <div className="sm:text-body text-bodySm mt-4 font-semibold text-black sm:mt-5">
                  {emptyText(tab)}
                </div>
                <p className="text-caption text-gray5 mt-2 leading-5 sm:leading-6">
                  다른 날짜를 선택해서 일정을 확인해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateAction && tab === 'MEMBER' && onCreateAction ? (
        <div className="shrink-0 bg-white">
          <Divider className="pt-6 pb-2" spacing={false} />
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
    </>
  );
}
