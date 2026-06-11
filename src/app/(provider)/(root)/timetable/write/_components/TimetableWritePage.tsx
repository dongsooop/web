'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import {
  DEFAULT_TIMETABLE_SEMESTER,
  DEFAULT_TIMETABLE_YEAR,
  TIMETABLE_REQUEST_WEEK,
} from '@/features/timetable/constants';
import { useCreateTimetable } from '@/features/timetable/hooks/useCreateTimetable';
import { useUpdateTimetable } from '@/features/timetable/hooks/useUpdateTimetable';
import { useTimetableQuery } from '@/features/timetable/hooks/useTimetableQuery';
import type { TimetableCreateRequest, TimetableUpdateRequest } from '@/features/timetable/types/request';
import type { TimetableSemester } from '@/features/timetable/types/response';
import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';

import TimetableCreatePanel from '../../_components/TimetableCreatePanel';
import type { TimetableItem } from '../../_components/timetable.data';

type TimetableWritePageProps = {
  id?: string;
};

export default function TimetableWritePage({ id }: TimetableWritePageProps) {
  const router = useRouter();
  const create = useCreateTimetable();
  const update = useUpdateTimetable();
  const showToast = useToastStore((state) => state.showToast);
  const { data } = useTimetableQuery(
    DEFAULT_TIMETABLE_YEAR,
    DEFAULT_TIMETABLE_SEMESTER as TimetableSemester,
  );

  const lecture = useMemo(() => {
    const lectureId = Number(id);

    if (!Number.isInteger(lectureId) || lectureId <= 0) {
      return undefined;
    }

    return data?.find((item) => item.id === lectureId);
  }, [data, id]);
  const saveLecture = useCallback(
    async (payload: TimetableItem) => {
      const request = {
        endAt: payload.endAt,
        location: payload.location,
        name: payload.name,
        professor: payload.professor,
        semester: DEFAULT_TIMETABLE_SEMESTER as TimetableSemester,
        startAt: payload.startAt,
        week: TIMETABLE_REQUEST_WEEK[payload.week],
        year: Number(DEFAULT_TIMETABLE_YEAR),
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
    [create, lecture, router, showToast, update],
  );

  return (
    <div className="mx-auto w-full py-4 sm:px-4">
      <div className="max-w-layout mx-auto w-full">
        <div className="border-gray2 overflow-hidden rounded-2xl border bg-white">
          <TimetableCreatePanel
            isSaving={create.isPending || update.isPending}
            item={lecture}
            mode="page"
            onCloseAction={() => router.push('/timetable')}
            onSaveAction={saveLecture}
          />
        </div>
      </div>
    </div>
  );
}
