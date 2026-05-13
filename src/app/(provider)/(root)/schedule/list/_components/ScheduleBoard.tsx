'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/ui/PageHeader';
import ToastView from '@/components/ui/ToastView';
import { ScheduleCreateProvider } from '../../_components/ScheduleCreateContext';
import ScheduleCreatePanel from '../../_components/ScheduleCreatePanel';
import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { lockBody, unlockBody } from '@/lib/body-lock';
import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';
import { toDateKey } from '@/utils/date';
import { useScheduleBoardData } from '../hooks/useScheduleBoardData';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleDetailPanel from './ScheduleDetailPanel';
import ScheduleDetailSheet from './ScheduleDetailSheet';
import ScheduleSkeleton from './ScheduleSkeleton';
import ScheduleTabs from './ScheduleTabs';

const tabs = [
  { id: 'MEMBER', label: '개인 일정' },
  { id: 'OFFICIAL', label: '학사 일정' },
] as const;

type ScheduleOverlayState =
  | { type: 'none' }
  | { type: 'detail' }
  | { type: 'create' };

type ScheduleViewState = {
  selected: string;
  tab: (typeof tabs)[number]['id'];
  view: Date;
};

function descriptionText() {
  return '학사 일정과 개인 일정을 확인하고 관리할 수 있어요.';
}

export default function ScheduleBoard() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [today] = useState(() => new Date());
  const [viewState, setViewState] = useState<ScheduleViewState>(() => ({
    selected: toDateKey(today),
    tab: 'MEMBER',
    view: new Date(today.getFullYear(), today.getMonth(), 1),
  }));
  const [overlay, setOverlay] = useState<ScheduleOverlayState>({ type: 'none' });
  const [showBanner, setShowBanner] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const create = useCreateSchedule();
  const { selected, tab, view } = viewState;
  const createOpen = overlay.type === 'create';
  const detailOpen = overlay.type === 'detail';
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

  useEffect(() => {
    if (!showBanner) return;

    const timer = window.setTimeout(() => {
      setShowBanner(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [showBanner]);

  useEffect(() => {
    if (!detailOpen) return;
    if (window.matchMedia('(min-width: 768px)').matches) return;

    lockBody();

    return () => {
      unlockBody();
    };
  }, [detailOpen]);

  const moveMonth = useCallback((delta: number) => {
    setViewState((state) => {
      const next = new Date(state.view.getFullYear(), state.view.getMonth() + delta, 1);
      const lastDate = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      const day = Number(state.selected.slice(8, 10)) || 1;
      const nextSelected = new Date(next.getFullYear(), next.getMonth(), Math.min(day, lastDate));

      return {
        ...state,
        selected: toDateKey(nextSelected),
        view: next,
      };
    });
  }, []);

  const moveToday = useCallback(() => {
    setViewState((state) => ({
      ...state,
      selected: toDateKey(today),
      view: new Date(today.getFullYear(), today.getMonth(), 1),
    }));
  }, [today]);

  const selectDate = useCallback((key: string) => {
    setViewState((state) => ({
      ...state,
      selected: key,
    }));

    if (window.matchMedia('(min-width: 640px)').matches) return;

    setOverlay((state) => {
      if (state.type === 'create') {
        return state;
      }

      return { type: 'detail' };
    });
  }, []);

  const changeTab = useCallback((next: ScheduleViewState['tab']) => {
    setViewState((state) => ({
      ...state,
      tab: next,
    }));

    if (next === 'OFFICIAL') {
      setOverlay({ type: 'none' });
      return;
    }

    setOverlay((state) => (state.type === 'detail' ? { type: 'none' } : state));
  }, []);

  const openCreate = useCallback(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) {
      router.push(`/schedule/write?date=${selected}`);
      return;
    }

    setOverlay({ type: 'create' });
  }, [router, selected]);

  const closeCreate = useCallback(() => {
    setOverlay((state) => (state.type === 'create' ? { type: 'none' } : state));
  }, []);

  const closeDetail = useCallback(() => {
    setOverlay((state) => (state.type === 'detail' ? { type: 'none' } : state));
  }, []);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await create.mutateAsync(payload);
        setOverlay({ type: 'none' });
        setShowBanner(true);
      } catch (error) {
        showToast(getErrorMessage('schedule', error), 'error');
      }
    },
    [create, showToast],
  );

  const createValue = useMemo(
    () => ({
      closeCreate,
      saveCreate,
    }),
    [closeCreate, saveCreate],
  );

  if (showSkeleton) {
    return (
      <div className="max-w-layout mx-auto flex w-full flex-col gap-4 sm:px-4">
        <div className="px-1">
          <PageHeader title="일정" description={descriptionText()} />
        </div>

        <ScheduleSkeleton />
      </div>
    );
  }

  return (
    <ScheduleCreateProvider value={createValue}>
      <div
        className={[
          'max-w-layout mx-auto flex w-full flex-col gap-4 sm:px-4',
          createOpen ? '' : 'sm:pb-0',
        ].join(' ')}
      >
        <div className="px-1">
          <PageHeader title="일정" description={descriptionText()} />
        </div>

        <section className="sm:border-gray2 sm:shadow-schedule-panel overflow-hidden rounded-2xl bg-white sm:border">
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
              {showBanner ? (
                <ToastView
                  toast={{
                    message: '일정이 추가되었어요!',
                    tone: 'success',
                  }}
                  onHideAction={closeBanner}
                  containerClassName="mx-6 mt-6 hidden md:flex"
                  toastClassName="animate-in fade-in slide-in-from-top-2 duration-200"
                />
              ) : null}
              {createOpen ? (
                <ScheduleCreatePanel />
              ) : (
                <ScheduleDetailPanel
                  displayErrorMessage={displayErrorMessage}
                  isError={isError}
                  onCreateAction={openCreate}
                  selectedDay={selectedDay}
                  selectedList={selectedList}
                  tab={tab}
                />
              )}
            </div>
          </div>
        </section>

        {!createOpen && detailOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
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
                onCreateAction={openCreate}
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
