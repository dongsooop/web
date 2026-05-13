import type { Schedule } from '@/features/schedule/types/ui-model';
import type { TabId } from './ScheduleTabs';
import ScheduleDetailContent from './ScheduleDetailContent';

type ScheduleDetailSheetProps = {
  displayErrorMessage: string | null;
  isError: boolean;
  onCreateAction?: () => void;
  onSelectScheduleAction?: (schedule: Schedule) => void;
  selectedDay: string;
  selectedList: Schedule[];
  tab: TabId;
};

export default function ScheduleDetailSheet({
  displayErrorMessage,
  isError,
  onCreateAction,
  onSelectScheduleAction,
  selectedDay,
  selectedList,
  tab,
}: ScheduleDetailSheetProps) {
  return (
    <aside className="border-gray2 flex max-h-[78vh] flex-col overflow-hidden rounded-t-xl border-t bg-white">
      <div className="flex shrink-0 items-center bg-white p-4">
        <div className="text-heading font-semibold text-black">{selectedDay}</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col pb-1">
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
