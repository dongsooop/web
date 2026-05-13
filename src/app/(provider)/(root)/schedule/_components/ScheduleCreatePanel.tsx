'use client';

import type { Schedule } from '@/features/schedule/types/ui-model';
import ScheduleCreateForm from './ScheduleCreateForm';

type ScheduleCreatePanelProps = {
  onDeleteAction?: () => void | Promise<void>;
  schedule?: Schedule;
};

export default function ScheduleCreatePanel({
  onDeleteAction,
  schedule,
}: ScheduleCreatePanelProps) {
  return (
    <aside className="border-gray2 hidden border-t bg-white md:flex md:min-h-0 md:flex-1 md:flex-col md:border-t-0">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white bg-white">
        <ScheduleCreateForm
          key={schedule?.id ? `edit-${schedule.id}` : 'create'}
          mode="panel"
          onDeleteAction={onDeleteAction}
          schedule={schedule}
        />
      </div>
    </aside>
  );
}
