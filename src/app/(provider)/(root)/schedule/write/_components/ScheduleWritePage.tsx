'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { ScheduleCreateProvider } from '../../_components/ScheduleCreateContext';
import ScheduleCreateForm from '../../_components/ScheduleCreateForm';
import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';

type ScheduleWritePageProps = {
  date?: string;
};

function parseDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  const next = new Date(year, month - 1, day);

  if (Number.isNaN(next.getTime())) {
    return undefined;
  }

  return next;
}

export default function ScheduleWritePage({ date }: ScheduleWritePageProps) {
  const router = useRouter();
  const create = useCreateSchedule();
  const showToast = useToastStore((state) => state.showToast);
  const initialDate = useMemo(() => parseDate(date), [date]);

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
        showToast(getErrorMessage('schedule', error), 'error');
      }
    },
    [create, router, showToast],
  );

  const createValue = useMemo(
    () => ({
      closeCreate: closeWrite,
      saveCreate,
    }),
    [closeWrite, saveCreate],
  );

  return (
    <ScheduleCreateProvider value={createValue}>
      <div className="max-w-layout mx-auto w-full py-4 sm:px-4">
        <div className="overflow-hidden rounded-2xl bg-white sm:border sm:border-gray2">
          <ScheduleCreateForm
            mode="page"
            initialDate={initialDate}
            onCloseAction={closeWrite}
            onSaveAction={saveCreate}
          />
        </div>
      </div>
    </ScheduleCreateProvider>
  );
}
