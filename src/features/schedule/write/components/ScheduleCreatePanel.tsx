import type { Schedule } from '@/features/schedule/types/ui-model';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import ScheduleCreateForm from './ScheduleCreateForm';

type ScheduleCreatePanelProps = {
  isDeleting?: boolean;
  isSaving?: boolean;
  onCloseAction: () => void;
  onDeleteAction?: () => void | Promise<void>;
  onSaveAction: (payload: ScheduleCreateRequest) => Promise<void>;
  schedule?: Schedule;
};

export default function ScheduleCreatePanel({
  isDeleting = false,
  isSaving = false,
  onCloseAction,
  onDeleteAction,
  onSaveAction,
  schedule,
}: ScheduleCreatePanelProps) {
  return (
    <aside
      className="border-gray2 hidden border-t bg-white md:flex md:min-h-0 md:flex-1 md:flex-col md:border-t-0"
      aria-label={schedule ? '일정 편집 패널' : '일정 추가 패널'}
    >
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white bg-white">
        <ScheduleCreateForm
          isDeleting={isDeleting}
          isSaving={isSaving}
          key={schedule?.id ? `edit-${schedule.id}` : 'create'}
          mode="panel"
          onCloseAction={onCloseAction}
          onDeleteAction={onDeleteAction}
          onSaveAction={onSaveAction}
          schedule={schedule}
        />
      </div>
    </aside>
  );
}
