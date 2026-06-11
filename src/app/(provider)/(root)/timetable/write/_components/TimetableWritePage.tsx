'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import TimetableCreatePanel from '../../_components/TimetableCreatePanel';
import { mockTimetable } from '../../_components/timetable.data';

type TimetableWritePageProps = {
  id?: string;
};

export default function TimetableWritePage({ id }: TimetableWritePageProps) {
  const router = useRouter();
  const lecture = useMemo(() => {
    const lectureId = Number(id);

    if (!Number.isInteger(lectureId) || lectureId <= 0) {
      return undefined;
    }

    return mockTimetable.find((item) => item.id === lectureId);
  }, [id]);

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
