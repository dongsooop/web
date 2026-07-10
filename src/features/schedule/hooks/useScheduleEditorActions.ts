import { useCallback } from 'react';

import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import { useDeleteSchedule } from '@/features/schedule/hooks/useDeleteSchedule';
import { useUpdateSchedule } from '@/features/schedule/hooks/useUpdateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

export type ScheduleActionKind = 'create' | 'update' | 'delete';

type UseScheduleEditorActionsOptions = {
  isEdit: boolean;
  scheduleId: number | null;
  onSuccess: (action: ScheduleActionKind) => void;
};

export function getScheduleSuccessMessage(action: ScheduleActionKind) {
  if (action === 'create') {
    return '일정이 추가되었어요!';
  }

  if (action === 'update') {
    return '일정이 수정되었어요!';
  }

  return '일정이 삭제되었어요!';
}

export function useScheduleEditorActions({
  isEdit,
  scheduleId,
  onSuccess,
}: UseScheduleEditorActionsOptions) {
  const create = useCreateSchedule();
  const remove = useDeleteSchedule();
  const update = useUpdateSchedule();
  const createSchedule = create.mutateAsync;
  const deleteSchedule = remove.mutateAsync;
  const updateSchedule = update.mutateAsync;
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await createSchedule(payload);
        onSuccess('create');
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'create'), 'error');
      }
    },
    [createSchedule, onSuccess, showToast],
  );

  const saveEdit = useCallback(
    async (payload: ScheduleCreateRequest) => {
      if (!scheduleId) {
        return;
      }

      try {
        await updateSchedule({
          id: scheduleId,
          payload,
        });
        onSuccess('update');
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'update'), 'error');
      }
    },
    [onSuccess, scheduleId, showToast, updateSchedule],
  );

  const deleteEdit = useCallback(async () => {
    if (!scheduleId) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);
      onSuccess('delete');
    } catch (error) {
      showToast(getErrorMessage('schedule', error, 'delete'), 'error');
    }
  }, [deleteSchedule, onSuccess, scheduleId, showToast]);

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

  return {
    isDeleting: remove.isPending,
    isSaving: isEdit ? update.isPending : create.isPending,
    openDeleteDialog,
    saveAction: isEdit ? saveEdit : saveCreate,
  };
}
