import { MapPin } from 'lucide-react';

import {
  formatScheduleDateText,
  formatScheduleTimeText,
} from '@/features/schedule/lib/calendar';
import { scheduleLineColor } from '@/features/schedule/lib/color';
import type { Schedule } from '@/features/schedule/types/ui-model';

type ScheduleDetailItemProps = {
  onSelectAction?: (schedule: Schedule) => void;
  schedule: Schedule;
  selectable: boolean;
};

export default function ScheduleDetailItem({
  onSelectAction,
  schedule,
  selectable,
}: ScheduleDetailItemProps) {
  const cardClassName = 'border-gray2 shadow-schedule-card min-h-11 rounded-2xl border bg-white';
  const timeText = formatScheduleTimeText(schedule);
  const content = (
    <>
      <span
        className={['mt-0.5 w-1 shrink-0 rounded-full', scheduleLineColor(schedule)].join(' ')}
        aria-hidden="true"
      />

      <span className="min-w-0 flex-1">
        <span className="text-caption text-gray6 font-regular flex items-center justify-between gap-3">
          <span className="truncate">{formatScheduleDateText(schedule)}</span>

          {timeText ? <span className="shrink-0">{timeText}</span> : null}
        </span>

        <span className="sm:text-body text-bodySm mt-1 block font-semibold text-black">
          {schedule.title}
        </span>

        {schedule.location ? (
          <span className="text-caption text-gray5 mt-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{schedule.location}</span>
          </span>
        ) : null}
      </span>
    </>
  );

  return selectable ? (
    <article className={cardClassName}>
      <button
        type="button"
        onClick={() => onSelectAction?.(schedule)}
        className="flex min-h-11 w-full cursor-pointer gap-3.5 p-3 text-left"
      >
        {content}
      </button>
    </article>
  ) : (
    <article className={cardClassName}>
      <div className="flex min-h-11 w-full gap-3.5 p-3 text-left">{content}</div>
    </article>
  );
}
