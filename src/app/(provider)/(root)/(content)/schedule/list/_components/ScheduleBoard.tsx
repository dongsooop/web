'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import PageHeader from '@/components/ui/PageHeader';
import ToastView from '@/components/ui/ToastView';
import { ScheduleCreateProvider } from '../../_components/ScheduleCreateContext';
import ScheduleCreatePanel from '../../_components/ScheduleCreatePanel';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLoginRequiredDialog } from '@/features/auth/hooks/useLoginRequiredDialog';
import { useCreateSchedule } from '@/features/schedule/hooks/useCreateSchedule';
import { useDeleteSchedule } from '@/features/schedule/hooks/useDeleteSchedule';
import { useUpdateSchedule } from '@/features/schedule/hooks/useUpdateSchedule';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { lockBody, unlockBody } from '@/lib/body-lock';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';
import { parseMonthKey, toDateKey, toMonthKey } from '@/utils/date';
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
  | { schedule: Schedule | null; type: 'create' };

type ScheduleViewState = {
  selected: string;
  tab: (typeof tabs)[number]['id'];
  view: Date;
};

type Banner = {
  id: number;
  message: string;
};

function descriptionText() {
  return '학사 일정과 개인 일정을 확인하고 관리할 수 있어요.';
}

export default function ScheduleBoard() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isReady } = useAuth();
  const openLoginDialog = useLoginRequiredDialog();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [today] = useState(() => new Date());
  const initialViewDate = useMemo(() => {
    const month = parseMonthKey(searchParams.get('month')?.trim());

    if (!month) {
      return today;
    }

    const [year, monthNumber] = month.split('-').map(Number);

    if (!year || !monthNumber) {
      return today;
    }

    return new Date(year, monthNumber - 1, 1);
  }, [searchParams, today]);
  const [viewState, setViewState] = useState<ScheduleViewState>(() => ({
    selected: toDateKey(initialViewDate),
    tab: 'MEMBER',
    view: new Date(initialViewDate.getFullYear(), initialViewDate.getMonth(), 1),
  }));
  const [overlay, setOverlay] = useState<ScheduleOverlayState>({ type: 'none' });
  const [banner, setBanner] = useState<Banner | null>(null);
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);
  const create = useCreateSchedule();
  const remove = useDeleteSchedule();
  const update = useUpdateSchedule();
  const { selected, view } = viewState;
  const tab = isReady && !isLoggedIn ? 'OFFICIAL' : viewState.tab;
  const createOpen = isLoggedIn && overlay.type === 'create';
  const detailOpen = overlay.type === 'detail';
  const editSchedule = isLoggedIn && overlay.type === 'create' ? overlay.schedule : null;
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

  const syncMonth = useCallback(
    (nextView: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('month', toMonthKey(nextView));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (!banner) return;

    const timer = window.setTimeout(() => {
      setBanner(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [banner]);

  useEffect(() => {
    const nextMonth = parseMonthKey(searchParams.get('month')?.trim());

    if (!nextMonth) {
      return;
    }

    const [year, monthNumber] = nextMonth.split('-').map(Number);

    if (!year || !monthNumber) {
      return;
    }

    const nextView = new Date(year, monthNumber - 1, 1);
    const nextKey = toDateKey(nextView);

    setViewState((state) => {
      if (toDateKey(state.view) === nextKey) {
        return state;
      }

      return {
        ...state,
        selected: nextKey,
        view: nextView,
      };
    });
  }, [searchParams]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');

    if (!detailOpen || media.matches) {
      unlockBody();
      return;
    }

    lockBody();

    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        unlockBody();
      }
    };

    media.addEventListener('change', onChange);

    return () => {
      media.removeEventListener('change', onChange);
      unlockBody();
    };
  }, [detailOpen]);

  const moveMonth = useCallback(
    (delta: number) => {
      const nextView = new Date(view.getFullYear(), view.getMonth() + delta, 1);
      const lastDate = new Date(nextView.getFullYear(), nextView.getMonth() + 1, 0).getDate();
      const day = Number(selected.slice(8, 10)) || 1;
      const nextSelected = new Date(
        nextView.getFullYear(),
        nextView.getMonth(),
        Math.min(day, lastDate),
      );

      syncMonth(nextView);
      setViewState((state) => ({
        ...state,
        selected: toDateKey(nextSelected),
        view: nextView,
      }));
    },
    [selected, syncMonth, view],
  );

  const moveToday = useCallback(() => {
    const nextView = new Date(today.getFullYear(), today.getMonth(), 1);
    syncMonth(nextView);

    setViewState((state) => ({
      ...state,
      selected: toDateKey(today),
      view: nextView,
    }));
  }, [syncMonth, today]);

  const selectDate = useCallback(
    (key: string) => {
      if (key === selected) {
        if (!window.matchMedia('(min-width: 640px)').matches) {
          setOverlay((state) => (state.type === 'none' ? { type: 'detail' } : state));
        }

        return;
      }

      setViewState((state) => ({
        ...state,
        selected: key,
      }));

      setOverlay((state) => {
        if (state.type === 'create') {
          return { type: 'none' };
        }

        return state;
      });

      if (window.matchMedia('(min-width: 640px)').matches) return;

      setOverlay(() => ({ type: 'detail' }));
    },
    [selected],
  );

  const changeTab = useCallback(
    (next: ScheduleViewState['tab']) => {
      if (next === 'MEMBER' && isReady && !isLoggedIn) {
        openLoginDialog();
        return;
      }

      setViewState((state) => ({
        ...state,
        tab: next,
      }));

      if (next === 'OFFICIAL') {
        setOverlay({ type: 'none' });
        return;
      }

      setOverlay((state) => (state.type === 'detail' ? { type: 'none' } : state));
    },
    [isLoggedIn, isReady, openLoginDialog],
  );

  const openCreate = useCallback(() => {
    if (isReady && !isLoggedIn) {
      openLoginDialog();
      return;
    }

    if (!window.matchMedia('(min-width: 768px)').matches) {
      router.push(`/schedule/write?date=${selected}`);
      return;
    }

    setOverlay({ type: 'create', schedule: null });
  }, [isLoggedIn, isReady, openLoginDialog, router, selected]);

  const openEdit = useCallback(
    (schedule: Schedule) => {
      if (tab !== 'MEMBER' || schedule.id === null) {
        return;
      }

      if (!window.matchMedia('(min-width: 768px)').matches) {
        router.push(`/schedule/write?id=${schedule.id}&month=${schedule.startDateKey.slice(0, 7)}`);
        return;
      }

      setOverlay({ type: 'create', schedule });
    },
    [router, tab],
  );

  const closeCreate = useCallback(() => {
    setOverlay((state) => (state.type === 'create' ? { type: 'none' } : state));
  }, []);

  const closeDetail = useCallback(() => {
    setOverlay((state) => (state.type === 'detail' ? { type: 'none' } : state));
  }, []);

  const closeBanner = useCallback(() => {
    setBanner(null);
  }, []);

  const saveCreate = useCallback(
    async (payload: ScheduleCreateRequest) => {
      try {
        await create.mutateAsync(payload);
        setOverlay({ type: 'none' });
        setBanner({ id: Date.now(), message: '일정이 추가되었어요!' });
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'create'), 'error');
      }
    },
    [create, showToast],
  );

  const saveEdit = useCallback(
    async (payload: ScheduleCreateRequest) => {
      if (!editSchedule?.id) {
        return;
      }

      try {
        await update.mutateAsync({
          id: editSchedule.id,
          payload,
        });
        setOverlay({ type: 'none' });
        setBanner({ id: Date.now(), message: '일정이 수정되었어요!' });
      } catch (error) {
        showToast(getErrorMessage('schedule', error, 'update'), 'error');
      }
    },
    [editSchedule, showToast, update],
  );

  const deleteEdit = useCallback(async () => {
    if (!editSchedule?.id) {
      return;
    }

    try {
      await remove.mutateAsync(editSchedule.id);
      setOverlay({ type: 'none' });
      setBanner({ id: Date.now(), message: '일정이 삭제되었어요!' });
    } catch (error) {
      showToast(getErrorMessage('schedule', error, 'delete'), 'error');
    }
  }, [editSchedule, remove, showToast]);

  const openDeleteDialog = useCallback(() => {
    if (!editSchedule?.id) {
      return;
    }

    showDialog({
      title: '일정 삭제',
      content: '선택한 일정을 삭제하시겠어요?\n삭제된 일정은 복구할 수 없어요.',
      cancel: '취소',
      confirm: '삭제',
      color: 'danger',
      onConfirm: deleteEdit,
    });
  }, [deleteEdit, editSchedule, showDialog]);

  const createValue = useMemo(
    () => ({
      closeCreate,
      saveCreate: editSchedule ? saveEdit : saveCreate,
    }),
    [closeCreate, editSchedule, saveCreate, saveEdit],
  );

  if (showSkeleton) {
    return (
      <div className="max-w-calendar mx-auto flex w-full flex-col gap-4 sm:px-4">
        <div className="px-1">
          <PageHeader
            title="일정"
            showBackButton
            description={descriptionText()}
          />
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
          <PageHeader
            title="일정"
            showBackButton
            description={descriptionText()}
          />
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
                  isDeleting={remove.isPending}
                  isSaving={editSchedule ? update.isPending : create.isPending}
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
