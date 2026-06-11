'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { DEFAULT_TIMETABLE_SEMESTER, DEFAULT_TIMETABLE_YEAR } from '@/features/timetable/constants';
import { useTimetableQuery } from '@/features/timetable/hooks/useTimetableQuery';
import type { TimetableSemester } from '@/features/timetable/types/response';

import TimetableCreatePanel from '../../_components/TimetableCreatePanel';

type TimetableWritePageProps = {
  id?: string;
};

export default function TimetableWritePage({ id }: TimetableWritePageProps) {
  const router = useRouter();
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

  return (
    <div className="mx-auto w-full py-4 sm:px-4">
      <div className="max-w-layout mx-auto w-full">
        <div className="border-gray2 overflow-hidden rounded-2xl border bg-white">
          <TimetableCreatePanel
            item={lecture}
            mode="page"
            onCloseAction={() => router.push('/timetable')}
            onSaveAction={() => router.push('/timetable')}
          />
        </div>
      </div>
    </div>
  );
}
