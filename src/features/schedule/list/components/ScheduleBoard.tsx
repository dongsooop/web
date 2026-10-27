'use client';

import { useSyncExternalStore } from 'react';
import { CalendarDays } from 'lucide-react';

import AcademicNav from '@/components/layout/AcademicNav';
import ToastView from '@/components/ui/ToastView';
import ScheduleCreatePanel from '@/features/schedule/write/components/ScheduleCreatePanel';
import { useScheduleBoardActions } from '../hooks/useScheduleBoardActions';
import { useScheduleBoardData } from '../hooks/useScheduleBoardData';
import { useScheduleBoardState } from '../hooks/useScheduleBoardState';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleDetailPanel from './ScheduleDetailPanel';
import ScheduleDetailSheet from './ScheduleDetailSheet';
import ScheduleSkeleton from './ScheduleSkeleton';
import ScheduleTabs from './ScheduleTabs';

const tabs = [
  { id: 'MEMBER', label: '개인 일정' },
  { id: 'OFFICIAL', label: '학사 일정' },
] as const;

type ScheduleBoardProps = {
  month?: string;
};

function ScheduleIntro() {
  return (
    <>
      <header className="home-intro">
        <div>
          <p className="home-date">ACADEMIC CALENDAR</p>
          <h1>
            중요한 일정, 놓치지 않게. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">학사 일정과 나의 계획을 달력에서 함께 확인해요.</p>
        </div>
        <span className="home-semester">학사 · 개인 일정</span>
      </header>
      <AcademicNav active="schedule" />
    </>
  );
}

export default function ScheduleBoard({ month }: ScheduleBoardProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const {
    createOpen,
    detailOpen,
    editSchedule,
    selected,
    tab,
    today,
    view,
    changeTab,
    closeCreate,
    closeDetail,
    moveMonth,
    moveToday,
    openCreate,
    openEdit,
    selectDate,
  } = useScheduleBoardState({ month });
  const {
    cells,
    currentMonth,
    displayErrorMessage,
    isError,
    scheduleMap,
    schedules,
    selectedDay,
    selectedList,
    showSkeleton,
  } = useScheduleBoardData({
    mounted,
    selected,
    tab,
    view,
  });
  const { banner, closeBanner, isDeleting, isSaving, openDeleteDialog, saveAction } =
    useScheduleBoardActions({
      closeCreate,
      editSchedule,
    });

  if (showSkeleton) {
    return (
      <div className="home-dashboard">
        <ScheduleIntro />
        <ScheduleSkeleton />
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      <ScheduleIntro />

      <section
        className="border-surface-border overflow-hidden rounded-xl border bg-white"
        aria-labelledby="schedule-title"
      >
        <div className="home-card-head px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <CalendarDays className="h-5 w-5" />
            </span>
            <h2 id="schedule-title">월간 일정</h2>
          </div>
          <span className="text-caption text-surface-muted font-semibold">
            날짜를 눌러 상세 보기
          </span>
        </div>
        <ScheduleTabs tab={tab} items={tabs} onChange={changeTab} />

        <div className="md:grid-cols-schedule grid gap-0">
          <ScheduleCalendar
            cells={cells}
            currentMonth={currentMonth}
            onCreateAction={openCreate}
            onMoveMonthAction={moveMonth}
            onSelectAction={selectDate}
            onTodayAction={moveToday}
            scheduleMap={scheduleMap}
            schedules={schedules}
            selected={selected}
            tab={tab}
            today={today}
          />

          <div className="md:border-l-surface-border hidden bg-white md:flex md:flex-col md:border-l">
            {banner ? (
              <ToastView
                toast={{
                  className: 'shadow-none',
                  id: banner.id,
                  message: banner.message,
                  tone: 'success',
                }}
                onHideAction={closeBanner}
                containerClassName="mx-6 mt-6 hidden md:flex"
                toastClassName="animate-in fade-in slide-in-from-top-2 duration-200"
              />
            ) : null}
            {createOpen ? (
              <ScheduleCreatePanel
                isDeleting={isDeleting}
                isSaving={isSaving}
                onCloseAction={closeCreate}
                onDeleteAction={editSchedule ? openDeleteDialog : undefined}
                onSaveAction={saveAction}
                schedule={editSchedule ?? undefined}
              />
            ) : (
              <ScheduleDetailPanel
                displayErrorMessage={displayErrorMessage}
                isError={isError}
                onCreateAction={openCreate}
                onSelectScheduleAction={openEdit}
                selectedDay={selectedDay}
                selectedList={selectedList}
                tab={tab}
              />
            )}
          </div>
        </div>
      </section>

      {!createOpen && detailOpen ? (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="일정 상세"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="상세 일정 닫기"
            onClick={closeDetail}
          />

          <div className="absolute inset-x-0 bottom-0 z-10">
            <ScheduleDetailSheet
              displayErrorMessage={displayErrorMessage}
              isError={isError}
              onCloseAction={closeDetail}
              onCreateAction={openCreate}
              onSelectScheduleAction={openEdit}
              selectedDay={selectedDay}
              selectedList={selectedList}
              tab={tab}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
