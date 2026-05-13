'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { ScheduleCreateProvider } from '../../_components/ScheduleCreateContext';
import ScheduleCreateForm from '../../_components/ScheduleCreateForm';
import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import { useDeleteSchedule } from '@/features/schedule/hooks/useDeleteSchedule';
import { useScheduleQuery } from '@/features/schedule/hooks/useScheduleQuery';
import { useUpdateSchedule } from '@/features/schedule/hooks/useUpdateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';
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
  const router = useRouter();
  const create = useCreateSchedule();
  const remove = useDeleteSchedule();
  const update = useUpdateSchedule();
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);
  const initialDate = useMemo(() => fromDateKey(date), [date]);
  const scheduleId = useMemo(() => parseId(id), [id]);
  const monthKey = useMemo(() => {
    const fromQuery = parseMonthKey(month);

    if (fromQuery) {
      return fromQuery;
    }

    return initialDate ? toMonthKey(initialDate) : toMonthKey(new Date());
  }, [initialDate, month]);
  const { data, isLoading, isQueryReady } = useScheduleQuery(monthKey);
  const schedule = useMemo(
    () => (scheduleId ? (data ?? []).find((item) => item.id === scheduleId) : undefined),
    [data, scheduleId],
  );
  const isEdit = scheduleId !== null;

  const closeWrite = useCallback(() => {
    router.push('/schedule');
  }, [router]);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await create.mutateAsync(payload);
        showToast('일정이 추가되었어요!', 'success');
        router.push('/schedule');
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'create'), 'error');
      }
    },
    [create, router, showToast],
  );

  const saveEdit = useCallback(
    async (payload: ScheduleCreateRequest) => {
      if (!scheduleId) {
        return;
      }

      try {
        await update.mutateAsync({
          id: scheduleId,
          payload,
        });
        showToast('일정이 수정되었어요!', 'success', 'shadow-none');
        router.push('/schedule');
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'update'), 'error');
      }
    },
    [router, scheduleId, showToast, update],
  );

  const deleteEdit = useCallback(async () => {
    if (!scheduleId) {
      return;
    }

    try {
      await remove.mutateAsync(scheduleId);
      showToast('일정이 삭제되었어요!', 'success');
      router.push('/schedule');
    } catch (error) {
      showToast(getErrorMessage('schedule', error, 'delete'), 'error');
    }
  }, [remove, router, scheduleId, showToast]);

  const openDeleteDialog = useCallback(() => {
    if (!scheduleId) {
      return;
    }

    showDialog({
      title: '일정 삭제',
      content: '선택한 일정을 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없어요.',
      cancel: '취소',
      confirm: '삭제',
      variant: 'danger',
      onConfirm: deleteEdit,
    });
  }, [deleteEdit, scheduleId, showDialog]);

  const createValue = useMemo(
    () => ({
      closeCreate: closeWrite,
      saveCreate: isEdit ? saveEdit : saveCreate,
    }),
    [closeWrite, isEdit, saveCreate, saveEdit],
  );

  if (isEdit && !schedule && (!isQueryReady || isLoading)) {
    return (
      <div className="max-w-layout mx-auto w-full py-4 sm:px-4">
        <div className="text-bodySm text-gray5 overflow-hidden rounded-2xl bg-white px-4 py-6 sm:border sm:border-gray2">
          일정을 불러오는 중이에요.
        </div>
      </div>
    );
  }

  if (isEdit && !schedule) {
    return (
      <div className="max-w-layout mx-auto w-full py-4 sm:px-4">
        <div className="text-bodySm text-gray5 overflow-hidden rounded-2xl bg-white px-4 py-6 sm:border sm:border-gray2">
          수정할 일정을 찾을 수 없어요.
        </div>
      </div>
    );
  }

  return (
    <ScheduleCreateProvider value={createValue}>
      <div className="max-w-layout mx-auto w-full py-4 sm:px-4">
        <div className="overflow-hidden rounded-2xl bg-white sm:border sm:border-gray2">
          <ScheduleCreateForm
            key={schedule?.id ? `edit-${schedule.id}` : `create-${date ?? 'default'}`}
            mode="page"
            initialDate={initialDate}
            onCloseAction={closeWrite}
            onDeleteAction={isEdit ? openDeleteDialog : undefined}
            onSaveAction={isEdit ? saveEdit : saveCreate}
            schedule={schedule}
          />
        </div>
      </div>
    </ScheduleCreateProvider>
  );
}
