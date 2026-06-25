import { X } from 'lucide-react';

import type { Schedule } from '@/features/schedule/types/ui-model';
import type { TabId } from './ScheduleTabs';
import ScheduleDetailContent from './ScheduleDetailContent';

type ScheduleDetailSheetProps = {
  displayErrorMessage: string | null;
  isError: boolean;
  onCloseAction?: () => void;
  onCreateAction?: () => void;
  onSelectScheduleAction?: (schedule: Schedule) => void;
  selectedDay: string;
  selectedList: Schedule[];
  tab: TabId;
};

export default function ScheduleDetailSheet({
  displayErrorMessage,
  isError,
  onCloseAction,
  onCreateAction,
  onSelectScheduleAction,
  selectedDay,
  selectedList,
  tab,
}: ScheduleDetailSheetProps) {
  return (
    <aside
      className="border-gray2 flex max-h-[78vh] flex-col overflow-hidden rounded-t-xl border-t bg-white"
      aria-label="상세 일정 패널"
    >
      <header className="flex h-11 shrink-0 items-center justify-between bg-white px-4">
        <h2 className="text-heading font-semibold text-black">{selectedDay}</h2>
        <button
          type="button"
          aria-label="상세 일정 닫기"
          onClick={onCloseAction}
          className="text-gray5 flex h-11 w-11 items-center justify-center"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>
      <div
        className={['flex min-h-0 flex-1 flex-col', tab === 'OFFICIAL' ? 'pb-6' : 'pb-1'].join(' ')}
      >
        <ScheduleDetailContent
          contentClassName="px-4"
          displayErrorMessage={displayErrorMessage}
          isError={isError}
          onCreateAction={onCreateAction}
          onSelectScheduleAction={onSelectScheduleAction}
          selectedDay={selectedDay}
          selectedList={selectedList}
          showCreateAction
          showHeader={false}
          tab={tab}
        />
      </div>
    </aside>
  );
}
