'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import { useDeleteSchedule } from '@/features/schedule/hooks/useDeleteSchedule';
import { useUpdateSchedule } from '@/features/schedule/hooks/useUpdateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

type UseScheduleWriteActionsOptions = {
  isEdit: boolean;
  scheduleId: number | null;
};

export function useScheduleWriteActions({
  isEdit,
  scheduleId,
}: UseScheduleWriteActionsOptions) {
  const router = useRouter();
  const create = useCreateSchedule();
  const remove = useDeleteSchedule();
  const update = useUpdateSchedule();
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);

  const closeWrite = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace('/schedule');
  }, [router]);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await create.mutateAsync(payload);
        showToast('일정이 추가되었어요!', 'success', 'shadow-none');
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
      showToast('일정이 삭제되었어요!', 'success', 'shadow-none');
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
      content: '선택한 일정을 삭제하시겠어요?\n삭제된 일정은 복구할 수 없어요.',
      cancel: '취소',
      confirm: '삭제',
      color: 'danger',
      onConfirm: deleteEdit,
    });
  }, [deleteEdit, scheduleId, showDialog]);

  const saveAction = isEdit ? saveEdit : saveCreate;

  return {
    closeWrite,
    isDeleting: remove.isPending,
    isSaving: isEdit ? update.isPending : create.isPending,
    openDeleteDialog,
    saveAction,
  };
}
