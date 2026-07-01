'use client';

import { useSyncExternalStore } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import ToastView from '@/components/ui/ToastView';
import { ScheduleCreateProvider } from '@/features/schedule/write/providers/ScheduleCreateProvider';
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

function descriptionText() {
  return '학사 일정과 개인 일정을 확인하고 관리할 수 있어요.';
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
  const { banner, closeBanner, createValue, isDeleting, isSaving, openDeleteDialog } =
    useScheduleBoardActions({
      closeCreate,
      editSchedule,
    });

  if (showSkeleton) {
    return (
      <div className="max-w-calendar mx-auto flex w-full flex-col gap-4 sm:px-4">
        <div className="px-1">
          <PageHeader title="일정" showBackButton description={descriptionText()} />
        </div>

        <ScheduleSkeleton />
      </div>
    );
  }

  return (
    <ScheduleCreateProvider value={createValue}>
      <div
        className={[
          'max-w-calendar mx-auto flex w-full flex-col gap-4 sm:px-4',
          createOpen ? '' : 'sm:pb-0',
        ].join(' ')}
      >
        <div className="px-1">
          <PageHeader title="일정" showBackButton description={descriptionText()} />
        </div>

        <section
          className="sm:border-gray2 sm:shadow-schedule-panel overflow-hidden rounded-xl bg-white sm:border"
          aria-label="일정 캘린더"
        >
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

            <div className="md:border-l-gray2 hidden bg-white md:flex md:flex-col md:border-l">
              {banner ? (
                <ToastView
                  toast={{
                    className:
                      banner.message === '일정이 수정되었어요!' ? 'shadow-none' : undefined,
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
                  onDeleteAction={editSchedule ? openDeleteDialog : undefined}
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
    </ScheduleCreateProvider>
  );
}
