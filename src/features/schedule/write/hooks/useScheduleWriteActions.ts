'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  getScheduleSuccessMessage,
  useScheduleEditorActions,
} from '@/features/schedule/hooks/useScheduleEditorActions';
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
  const showToast = useToastStore((state) => state.showToast);

  const closeWrite = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace('/schedule');
  }, [router]);

  const { isDeleting, isSaving, openDeleteDialog, saveAction } = useScheduleEditorActions({
    isEdit,
    scheduleId,
    onSuccess: (action) => {
      showToast(getScheduleSuccessMessage(action), 'success', 'shadow-none');
      router.push('/schedule');
    },
  });

  return {
    closeWrite,
    isDeleting,
    isSaving,
    openDeleteDialog,
    saveAction,
  };
}
