import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLoginRequiredDialog } from '@/features/auth/hooks/useLoginRequiredDialog';
import { moveMonthState } from '@/features/schedule/lib/calendar';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { lockBody, unlockBody } from '@/lib/body-lock';
import { parseMonthKey, toDateKey, toMonthKey } from '@/utils/date';
import type { TabId } from '../components/ScheduleTabs';

type ScheduleOverlayState =
  | { type: 'none' }
  | { type: 'detail' }
  | { schedule: Schedule | null; type: 'create' };

type ScheduleViewState = {
  selected: string;
  tab: TabId;
  view: Date;
};

type UseScheduleBoardStateOptions = {
  month?: string;
};

function monthView(month: string | undefined, today: Date) {
  const nextMonth = parseMonthKey(month?.trim());

  if (!nextMonth) {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  const [year, monthNumber] = nextMonth.split('-').map(Number);

  if (!year || !monthNumber) {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return new Date(year, monthNumber - 1, 1);
}

function initialSelectedKey(view: Date, today: Date) {
  const isCurrentMonth =
    view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  return toDateKey(isCurrentMonth ? today : view);
}

function isDesktopPanel() {
  return window.matchMedia('(min-width: 768px)').matches;
}

export function useScheduleBoardState({ month }: UseScheduleBoardStateOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const openLoginDialog = useLoginRequiredDialog();
  const [today] = useState(() => new Date());
  const targetView = useMemo(() => monthView(month, today), [month, today]);
  const targetKey = useMemo(() => initialSelectedKey(targetView, today), [targetView, today]);
  const [viewState, setViewState] = useState<ScheduleViewState>(() => ({
    selected: targetKey,
    tab: 'MEMBER',
    view: targetView,
  }));
  const [overlay, setOverlay] = useState<ScheduleOverlayState>({ type: 'none' });
  const { selected, view } = viewState;
  const tab = isReady && !isLoggedIn ? 'OFFICIAL' : viewState.tab;
  const createOpen = isLoggedIn && overlay.type === 'create';
  const detailOpen = overlay.type === 'detail';
  const editSchedule = isLoggedIn && overlay.type === 'create' ? overlay.schedule : null;

  const syncMonth = useCallback(
    (nextView: Date) => {
      const params = new URLSearchParams();
      params.set('month', toMonthKey(nextView));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

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
      const nextState = moveMonthState(view, selected, delta);

      syncMonth(nextState.view);
      setViewState((state) => ({
        ...state,
        selected: nextState.selectedDateKey,
        view: nextState.view,
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

  const closeCreate = useCallback(() => {
    setOverlay((state) => (state.type === 'create' ? { type: 'none' } : state));
  }, []);

  const closeDetail = useCallback(() => {
    setOverlay((state) => (state.type === 'detail' ? { type: 'none' } : state));
  }, []);

  const selectDate = useCallback(
    (key: string) => {
      if (key === selected) {
        if (!isDesktopPanel()) {
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

      if (isDesktopPanel()) {
        return;
      }

      setOverlay({ type: 'detail' });
    },
    [selected],
  );

  const changeTab = useCallback(
    (next: TabId) => {
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

    if (!isDesktopPanel()) {
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

      if (!isDesktopPanel()) {
        router.push(`/schedule/write?id=${schedule.id}&month=${schedule.startDateKey.slice(0, 7)}`);
        return;
      }

      setOverlay({ type: 'create', schedule });
    },
    [router, tab],
  );

  return {
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
  };
}
