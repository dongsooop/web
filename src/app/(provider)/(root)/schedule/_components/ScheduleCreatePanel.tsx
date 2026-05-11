import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import ScheduleCreateForm from './ScheduleCreateForm';

type ScheduleCreatePanelProps = {
  onCloseAction: () => void;
  onSaveAction: (payload: ScheduleCreateRequest) => void | Promise<void>;
};

export default function ScheduleCreatePanel({
  onCloseAction,
  onSaveAction,
}: ScheduleCreatePanelProps) {
  return (
    <aside className="border-gray2 hidden border-t bg-white md:flex md:min-h-0 md:flex-1 md:flex-col md:border-t-0">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white bg-white">
        <ScheduleCreateForm
          mode="panel"
          onCloseAction={onCloseAction}
          onSaveAction={onSaveAction}
        />
      </div>
    </aside>
  );
}
