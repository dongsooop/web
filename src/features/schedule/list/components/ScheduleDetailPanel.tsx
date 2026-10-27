import type { Schedule } from '@/features/schedule/types/ui-model';
import type { TabId } from './ScheduleTabs';
import ScheduleDetailContent from './ScheduleDetailContent';

type ScheduleDetailPanelProps = {
  displayErrorMessage: string | null;
  isError: boolean;
  onCreateAction?: () => void;
  onSelectScheduleAction?: (schedule: Schedule) => void;
  selectedDay: string;
  selectedList: Schedule[];
  tab: TabId;
};

export default function ScheduleDetailPanel(props: ScheduleDetailPanelProps) {
  return (
    <aside className="border-surface-border border-t bg-white p-4 sm:px-6 md:border-t-0">
      <ScheduleDetailContent {...props} listClassName="sm:pt-6" />
    </aside>
  );
}
