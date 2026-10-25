'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Table2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { useCreateTimetable } from '@/features/timetable/hooks/useCreateTimetable';
import { useDeleteTimetable } from '@/features/timetable/hooks/useDeleteTimetable';
import { useUpdateTimetable } from '@/features/timetable/hooks/useUpdateTimetable';
import { useTimetableQuery } from '@/features/timetable/hooks/useTimetableQuery';
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import type {
  TimetableCreateRequest,
  TimetableUpdateRequest,
} from '@/features/timetable/types/request';
import AcademicNav from '@/components/layout/AcademicNav';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToastStore } from '@/store/useToastStore';
import { getErrorMessage } from '@/lib/errors/messages';

import TimetableCreatePanel from './TimetableCreatePanel';
import TimetableDetailPanel from './TimetableDetailPanel';
import TimetableGrid from './TimetableGrid';
import TimetablePanelEmpty from './TimetablePanelEmpty';
import type { TimetableItem, TimetablePreview } from '@/features/timetable/ui';
import {
  getCurrentTimetableSemester,
  getCurrentTimetableYear,
  TIMETABLE_SEMESTER_LABEL,
} from '@/features/timetable/constants';

type PanelState =
  | { type: 'create' }
  | { id: number; type: 'detail' }
  | { id: number; type: 'edit' }
  | { type: 'idle' };

export default function TimetablePageContent() {
  const router = useRouter();
  const { isRedirecting } = useAuthGuard('/mypage');
  const create = useCreateTimetable();
  const remove = useDeleteTimetable();
  const update = useUpdateTimetable();
  const showToast = useToastStore((state) => state.showToast);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const year = getCurrentTimetableYear();
  const semester = getCurrentTimetableSemester();
  const semesterLabel = TIMETABLE_SEMESTER_LABEL[semester];
  const { data, isLoading, isError, isQueryReady, displayErrorMessage } = useTimetableQuery(
    year,
    semester,
  );
  const [localLectures, setLocalLectures] = useState<TimetableItem[] | null>(null);
  const [mobileDetailId, setMobileDetailId] = useState<number | null>(null);
  const [panel, setPanel] = useState<PanelState>({ type: 'idle' });
  const [preview, setPreview] = useState<TimetablePreview | null>(null);
  const lectures = useMemo(() => localLectures ?? data ?? [], [data, localLectures]);

  const activeLecture = useMemo(
    () => ('id' in panel ? (lectures.find((lecture) => lecture.id === panel.id) ?? null) : null),
    [lectures, panel],
  );
  const mobileLecture = useMemo(
    () => lectures.find((lecture) => lecture.id === mobileDetailId) ?? null,
    [lectures, mobileDetailId],
  );

  const saveLecture = useCallback(
    async (payload: TimetableItem) => {
      const exists = lectures.some((lecture) => lecture.id === payload.id);
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

      if (exists) {
        try {
          await update.mutateAsync({
            ...request,
            id: payload.id,
          } satisfies TimetableUpdateRequest);
          setLocalLectures(null);
          setPreview(null);
          setPanel({ id: payload.id, type: 'detail' });
          showToast('시간표가 수정되었어요!', 'success', 'shadow-none');
        } catch (error) {
          showToast(getErrorMessage('timetable', error, 'update'), 'error');
        }
        return;
      }

      try {
        await create.mutateAsync(request satisfies TimetableCreateRequest);
        setLocalLectures(null);
        setPreview(null);
        setPanel({ type: 'idle' });
        showToast('시간표가 추가되었어요!', 'success', 'shadow-none');
      } catch (error) {
        showToast(getErrorMessage('timetable', error, 'create'), 'error');
      }
    },
    [create, lectures, semester, showToast, update, year],
  );

  const deleteLecture = useCallback(
    async (id: number) => {
      try {
        await remove.mutateAsync(id);
        setLocalLectures((prev) => {
          const current = prev ?? data ?? [];
          return current.filter((lecture) => lecture.id !== id);
        });
        setPreview(null);
        setPanel({ type: 'idle' });
        setMobileDetailId(null);
        showToast('시간표가 삭제되었어요!', 'success', 'shadow-none');
      } catch (error) {
        showToast(getErrorMessage('timetable', error, 'delete'), 'error');
      }
    },
    [data, remove, showToast],
  );

  const openEditPanel = useCallback((id: number) => {
    setIsEditingDetail(true);

    requestAnimationFrame(() => {
      setPanel({ id, type: 'edit' });
      setIsEditingDetail(false);
    });
  }, []);

  const moveToEditPage = useCallback(
    (id: number) => {
      setIsEditingDetail(true);
      router.push(`/timetable/write?id=${id}`);
    },
    [router],
  );

  if (isRedirecting) {
    return <div className="w-full" />;
  }

  return (
    <div className="home-dashboard">
      <header className="home-intro">
        <div>
          <p className="home-date">MY ACADEMICS</p>
          <h1>
            이번 학기도, 한눈에. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">수업 시간과 강의 정보를 한곳에서 관리해요.</p>
        </div>
        <span className="home-semester">
          {year}년 {semesterLabel}
        </span>
      </header>

      <AcademicNav active="timetable" />

      <section
        className="border-surface-border overflow-hidden rounded-xl border bg-white"
        aria-labelledby="timetable-title"
      >
        <div className="home-card-head border-surface-border border-b px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <Table2 className="h-5 w-5" />
            </span>
            <h2 id="timetable-title">
              {year}년 {semesterLabel} 시간표
            </h2>
          </div>

          <Link
            href="/timetable/write"
            className="text-primary hover:bg-surface-blue focus-visible:ring-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none sm:hidden"
            aria-label="강의 추가"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setPanel({ type: 'create' })}
            className="text-primary border-surface-border hover:bg-surface-blue focus-visible:ring-primary hidden min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>강의 추가</span>
          </button>
        </div>

        <div className="lg:grid-cols-schedule grid gap-0">
          <div className="flex min-w-0 flex-col p-4 sm:p-6 lg:min-h-[44rem]">
            <div className="w-full lg:min-h-[44rem]">
              {!isQueryReady || (isLoading && lectures.length === 0) ? (
                <Skeleton className="min-h-[36rem] w-full rounded-xl lg:min-h-[44rem]" />
              ) : isError ? (
                <p
                  className="text-body text-surface-muted flex min-h-[240px] items-center justify-center text-center whitespace-pre-line"
                  role="alert"
                >
                  {displayErrorMessage}
                </p>
              ) : (
                <TimetableGrid
                  lectures={lectures}
                  preview={preview}
                  onSelectAction={(lecture) => {
                    setPreview(null);
                    setPanel({ id: lecture.id, type: 'detail' });
                    setMobileDetailId(lecture.id);
                  }}
                />
              )}
            </div>
          </div>

          <div className="border-surface-border hidden lg:block lg:border-l">
            {panel.type === 'create' ? (
              <TimetableCreatePanel
                key="create"
                isSaving={create.isPending}
                lectures={lectures}
                onCloseAction={() => {
                  setPreview(null);
                  setPanel({ type: 'idle' });
                }}
                onPreviewAction={setPreview}
                onSaveAction={saveLecture}
              />
            ) : panel.type === 'edit' && activeLecture ? (
              <TimetableCreatePanel
                key={`edit-${activeLecture.id}`}
                isSaving={update.isPending}
                item={activeLecture}
                lectures={lectures}
                onCloseAction={() => {
                  setPreview(null);
                  setPanel({ id: activeLecture.id, type: 'detail' });
                }}
                onPreviewAction={setPreview}
                onSaveAction={saveLecture}
              />
            ) : panel.type === 'detail' && activeLecture ? (
              <TimetableDetailPanel
                isDeleting={remove.isPending}
                isEditing={isEditingDetail}
                lecture={activeLecture}
                onCloseAction={() => {
                  setPreview(null);
                  setIsEditingDetail(false);
                  setPanel({ type: 'idle' });
                }}
                onDeleteAction={() => deleteLecture(activeLecture.id)}
                onEditAction={() => openEditPanel(activeLecture.id)}
              />
            ) : (
              <TimetablePanelEmpty />
            )}
          </div>
        </div>
      </section>

      {mobileLecture ? (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="강의 정보"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/40"
            aria-label="강의 정보 닫기"
            onClick={() => setMobileDetailId(null)}
          />

          <div className="absolute inset-x-0 bottom-0 z-10">
            <TimetableDetailPanel
              isDeleting={remove.isPending}
              isEditing={isEditingDetail}
              lecture={mobileLecture}
              mode="sheet"
              onCloseAction={() => setMobileDetailId(null)}
              onDeleteAction={() => deleteLecture(mobileLecture.id)}
              onEditAction={() => moveToEditPage(mobileLecture.id)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
