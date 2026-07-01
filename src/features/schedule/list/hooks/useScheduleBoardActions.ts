import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import { useDeleteSchedule } from '@/features/schedule/hooks/useDeleteSchedule';
import { useUpdateSchedule } from '@/features/schedule/hooks/useUpdateSchedule';
import type { ScheduleCreateContextValue } from '@/features/schedule/write/providers/ScheduleCreateProvider';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

type Banner = {
  id: number;
  message: string;
};

type UseScheduleBoardActionsOptions = {
  closeCreate: () => void;
  editSchedule: Schedule | null;
};

export function useScheduleBoardActions({
  closeCreate,
  editSchedule,
}: UseScheduleBoardActionsOptions) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);
  const create = useCreateSchedule();
  const remove = useDeleteSchedule();
  const update = useUpdateSchedule();

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timer = window.setTimeout(() => {
      setBanner(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [banner]);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await create.mutateAsync(payload);
        closeCreate();
        setBanner({ id: Date.now(), message: '일정이 추가되었어요!' });
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'create'), 'error');
      }
    },
    [closeCreate, create, showToast],
  );

  const saveEdit = useCallback(
    async (payload: ScheduleCreateRequest) => {
      if (!editSchedule?.id) {
        return;
      }

      try {
        await update.mutateAsync({
          id: editSchedule.id,
          payload,
        });
        closeCreate();
        setBanner({ id: Date.now(), message: '일정이 수정되었어요!' });
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'update'), 'error');
      }
    },
    [closeCreate, editSchedule, showToast, update],
  );

  const deleteEdit = useCallback(async () => {
    if (!editSchedule?.id) {
      return;
    }

    try {
      await remove.mutateAsync(editSchedule.id);
      closeCreate();
      setBanner({ id: Date.now(), message: '일정이 삭제되었어요!' });
    } catch (error) {
      showToast(getErrorMessage('schedule', error, 'delete'), 'error');
    }
  }, [closeCreate, editSchedule, remove, showToast]);

  const openDeleteDialog = useCallback(() => {
    if (!editSchedule?.id) {
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
  }, [deleteEdit, editSchedule, showDialog]);

  const createValue = useMemo<ScheduleCreateContextValue>(
    () => ({
      closeCreate,
      saveCreate: editSchedule ? saveEdit : saveCreate,
    }),
    [closeCreate, editSchedule, saveCreate, saveEdit],
  );

  const closeBanner = useCallback(() => {
    setBanner(null);
  }, []);

  return {
    banner,
    closeBanner,
    createValue,
    isDeleting: remove.isPending,
    isSaving: editSchedule ? update.isPending : create.isPending,
    openDeleteDialog,
  };
}
