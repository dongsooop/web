'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import {
  getCurrentTimetableSemester,
  getCurrentTimetableYear,
} from '@/features/timetable/constants';
import { useCreateTimetable } from '@/features/timetable/hooks/useCreateTimetable';
import { useUpdateTimetable } from '@/features/timetable/hooks/useUpdateTimetable';
import { useTimetableQuery } from '@/features/timetable/hooks/useTimetableQuery';
import type { TimetableCreateRequest, TimetableUpdateRequest } from '@/features/timetable/types/request';
import type { TimetableItem } from '@/features/timetable/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';

import TimetableCreatePanel from '../../_components/TimetableCreatePanel';

type TimetableWritePageProps = {
  id?: string;
};

export default function TimetableWritePage({ id }: TimetableWritePageProps) {
  const router = useRouter();
  const create = useCreateTimetable();
  const update = useUpdateTimetable();
  const showToast = useToastStore((state) => state.showToast);
  const year = getCurrentTimetableYear();
  const semester = getCurrentTimetableSemester();
  const { data, isLoading, isQueryReady, isError, displayErrorMessage } = useTimetableQuery(
    year,
    semester,
  );
  const hasEditId = typeof id === 'string' && id.length > 0;
  const lectureId = Number(id);
  const isInvalidEditId = hasEditId && (!Number.isInteger(lectureId) || lectureId <= 0);

  const lecture = useMemo(() => {
    if (isInvalidEditId) {
      return undefined;
    }

    return data?.find((item) => item.id === lectureId);
  }, [data, isInvalidEditId, lectureId]);

  const isMissingLecture = hasEditId && isQueryReady && !isLoading && !lecture;
  const saveLecture = useCallback(
    async (payload: TimetableItem) => {
      const request = {
        endAt: payload.endAt,
        location: payload.location,
        name: payload.name,
        professor: payload.professor,
        semester,
        startAt: payload.startAt,
        week: payload.week,
        year: Number(year),
      };

      if (lecture) {
        try {
          await update.mutateAsync({
            ...request,
            id: lecture.id,
          } satisfies TimetableUpdateRequest);
          showToast('시간표가 수정되었어요!', 'success', 'shadow-none');
          router.push('/timetable');
        } catch (error) {
          showToast(getErrorMessage('timetable', error, 'update'), 'error');
        }
        return;
      }

      try {
        await create.mutateAsync(request satisfies TimetableCreateRequest);
        showToast('시간표가 추가되었어요!', 'success', 'shadow-none');
        router.push('/timetable');
      } catch (error) {
        showToast(getErrorMessage('timetable', error, 'create'), 'error');
      }
    },
    [create, lecture, router, semester, showToast, update, year],
  );

  return (
    <div className="mx-auto w-full py-4 sm:px-4">
      <div className="max-w-layout mx-auto w-full">
        {!isQueryReady || isLoading ? (
          <Skeleton className="min-h-[36rem] w-full rounded-2xl lg:min-h-[44rem]" />
        ) : isError ? (
          <div className="border-gray2 flex min-h-[20rem] items-center justify-center rounded-2xl border bg-white px-6 text-center">
            <p className="text-body text-gray5">{displayErrorMessage}</p>
          </div>
        ) : isInvalidEditId || isMissingLecture ? (
          <div className="border-gray2 flex min-h-[20rem] items-center justify-center rounded-2xl border bg-white px-6 text-center">
            <p className="text-body text-gray5">수정할 강의 정보를 찾을 수 없어요.</p>
          </div>
        ) : (
          <div className="border-gray2 overflow-hidden rounded-2xl border bg-white">
            <TimetableCreatePanel
              isSaving={create.isPending || update.isPending}
              item={lecture}
              lectures={data ?? []}
              mode="page"
              onCloseAction={() => router.push('/timetable')}
              onSaveAction={saveLecture}
            />
          </div>
        )}
      </div>
    </div>
  );
}
