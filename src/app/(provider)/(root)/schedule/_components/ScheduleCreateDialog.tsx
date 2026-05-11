'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import ScheduleCreateForm from './ScheduleCreateForm';

type ScheduleCreateDialogProps = {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (payload: ScheduleCreateRequest) => void | Promise<void>;
};

export default function ScheduleCreateDialog({
  open,
  onCloseAction,
  onSaveAction,
}: ScheduleCreateDialogProps) {
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia('(min-width: 768px)').matches) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:hidden"
      onClick={onCloseAction}
    >
      <div
        className="flex max-h-screen w-full flex-col rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ScheduleCreateForm
          mode="sheet"
          onCloseAction={onCloseAction}
          onSaveAction={onSaveAction}
        />
      </div>
    </div>,
    document.body,
  );
}
