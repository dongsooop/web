'use client';

import ScheduleCreateForm from './ScheduleCreateForm';

export default function ScheduleCreatePanel() {
  return (
    <aside className="border-gray2 hidden border-t bg-white md:flex md:min-h-0 md:flex-1 md:flex-col md:border-t-0">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white bg-white">
        <ScheduleCreateForm mode="panel" />
      </div>
    </aside>
  );
}
