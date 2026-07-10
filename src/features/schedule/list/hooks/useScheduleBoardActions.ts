import { useCallback, useEffect, useState } from 'react';

import {
  getScheduleSuccessMessage,
  useScheduleEditorActions,
} from '@/features/schedule/hooks/useScheduleEditorActions';
import type { Schedule } from '@/features/schedule/types/ui-model';

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

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timer = window.setTimeout(() => {
      setBanner(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [banner]);

  const { isDeleting, isSaving, openDeleteDialog, saveAction } = useScheduleEditorActions({
    isEdit: editSchedule !== null,
    scheduleId: editSchedule?.id ?? null,
    onSuccess: (action) => {
      closeCreate();
      setBanner({ id: Date.now(), message: getScheduleSuccessMessage(action) });
    },
  });

  const closeBanner = useCallback(() => {
    setBanner(null);
  }, []);

  return {
    banner,
    closeBanner,
    isDeleting,
    isSaving,
    openDeleteDialog,
    saveAction,
  };
}
