'use client';

import ScheduleCreateForm from './ScheduleCreateForm';
import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import { useScheduleWriteActions } from '@/features/schedule/write/hooks/useScheduleWriteActions';
import { fromDateKey, parseMonthKey, toMonthKey } from '@/utils/date';

type ScheduleWritePageProps = {
  date?: string;
  id?: string;
  month?: string;
};

function parseId(value?: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function ScheduleWritePage({ date, id, month }: ScheduleWritePageProps) {
  const initialDate = fromDateKey(date);
  const scheduleId = parseId(id);
  const fromQuery = parseMonthKey(month);
  const monthKey = fromQuery ?? (initialDate ? toMonthKey(initialDate) : toMonthKey(new Date()));
  const { data, displayErrorMessage, isError, isLoading, isQueryReady } =
    useScheduleQuery(monthKey);
  const schedule = scheduleId ? (data ?? []).find((item) => item.id === scheduleId) : undefined;
  const isEdit = scheduleId !== null;
  const { closeWrite, isDeleting, isSaving, openDeleteDialog, saveAction } =
    useScheduleWriteActions({
      isEdit,
      scheduleId,
    });
  let writeMessage: string | null = null;

  if (isEdit && !schedule) {
    if (!isQueryReady || isLoading) {
      writeMessage = '일정을 불러오는 중이에요.';
    } else if (isError) {
      writeMessage = displayErrorMessage;
    } else {
      writeMessage = '수정할 일정을 찾을 수 없어요.';
    }
  }

  if (writeMessage) {
    return (
      <div className="max-w-calendar mx-auto w-full py-4 sm:px-4">
        <div className="text-bodySm text-gray5 sm:border-gray2 overflow-hidden rounded-2xl bg-white px-4 py-6 sm:border">
          {writeMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-calendar mx-auto w-full py-4 sm:px-4">
      <div className="sm:border-gray2 overflow-hidden rounded-2xl bg-white sm:border">
        <ScheduleCreateForm
          isDeleting={isDeleting}
          isSaving={isSaving}
          key={schedule?.id ? `edit-${schedule.id}` : `create-${date ?? 'default'}`}
          mode="page"
          initialDate={initialDate}
          onCloseAction={closeWrite}
          onDeleteAction={isEdit ? openDeleteDialog : undefined}
          onSaveAction={saveAction}
          schedule={schedule}
        />
      </div>
    </div>
  );
}
