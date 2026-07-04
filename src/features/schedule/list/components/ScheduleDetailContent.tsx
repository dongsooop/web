import { CalendarDays, PlusCircle } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';
import type { Schedule } from '@/features/schedule/types/ui-model';
import type { TabId } from './ScheduleTabs';
import ScheduleDetailItem from './ScheduleDetailItem';

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

export default function ScheduleDetailContent({
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
  const hasSchedules = selectedList.length > 0;

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-white" aria-label="선택한 날짜의 일정">
      <div className={['flex flex-col gap-6', contentClassName].join(' ')}>
        {showHeader ? (
          <header>
            <h2 className="text-heading font-semibold text-black">{selectedDay}</h2>
            <p className="text-gray5 text-bodySm mt-1 hidden md:block">{helperText(tab)}</p>
          </header>
        ) : null}

        <div className={listClassName}>
          {isError ? (
            <div
              className="border-warning/10 bg-warning/10 text-warning text-bodySm rounded-2xl border px-4 py-5"
              role="alert"
            >
              {displayErrorMessage}
            </div>
          ) : hasSchedules ? (
            <ul className="flex flex-col gap-3">
              {selectedList.map((schedule, index) => {
                const selectable = tab === 'MEMBER' && schedule.id !== null;

                return (
                  <li key={`${schedule.title}-${schedule.startAt}-${index}`}>
                    <ScheduleDetailItem
                      onSelectAction={onSelectScheduleAction}
                      schedule={schedule}
                      selectable={selectable}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="bg-gray7 flex min-h-45 flex-col items-center justify-center rounded-xl px-6 text-center sm:min-h-60">
              <div className="shadow-schedule-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-white sm:h-16 sm:w-16">
                <CalendarDays className="text-gray5 h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
              </div>
              <p className="sm:text-body text-bodySm mt-4 font-semibold text-black sm:mt-5">
                {emptyText(tab)}
              </p>
              <p className="text-caption text-gray5 mt-2 leading-5 sm:leading-6">
                다른 날짜를 선택해서 일정을 확인해보세요.
              </p>
            </div>
          )}
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
            <PlusCircle className="h-5 w-5" aria-hidden="true" />
            일정 추가하기
          </button>
        </div>
      ) : null}
    </section>
  );
}
