'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CalendarDays, ChevronRight, Clock3, LockKeyhole } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { HomeUiModel } from '@/features/home/types/ui-model';

type TodayCampusCardProps = {
  timetable: HomeUiModel['timetable'];
  schedules: HomeUiModel['schedules'];
};

export default function TodayCampusCard({ timetable, schedules }: TodayCampusCardProps) {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState<'class' | 'schedule'>('class');
  const items = useMemo(
    () => (tab === 'class' ? timetable : schedules),
    [tab, timetable, schedules],
  );
  const href = tab === 'class' ? '/timetable' : '/schedule';

  return (
    <section className="border-primary/15 rounded-[28px] border bg-white p-5 sm:p-7 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-surface-blue text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-black sm:text-2xl">
            오늘의 캠퍼스
          </h2>
        </div>
        <Link
          href={href}
          className="text-surface-muted hover:bg-surface-soft focus-visible:ring-primary inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          전체보기
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div
        className="bg-surface-soft mt-6 grid grid-cols-2 rounded-2xl p-1"
        role="tablist"
        aria-label="오늘의 캠퍼스 정보"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'class'}
          onClick={() => setTab('class')}
          className={`focus-visible:ring-primary min-h-12 cursor-pointer rounded-xl px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none ${
            tab === 'class'
              ? 'text-primary bg-white shadow-sm'
              : 'text-surface-muted hover:text-black'
          }`}
        >
          수업 <span className="ml-1 tabular-nums">{timetable.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'schedule'}
          onClick={() => setTab('schedule')}
          className={`focus-visible:ring-primary min-h-12 cursor-pointer rounded-xl px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none ${
            tab === 'schedule'
              ? 'text-primary bg-white shadow-sm'
              : 'text-surface-muted hover:text-black'
          }`}
        >
          일정 <span className="ml-1 tabular-nums">{schedules.length}</span>
        </button>
      </div>

      {!isLoggedIn ? (
        <div className="bg-surface-blue text-surface-muted mt-5 flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl px-5 text-center sm:flex-row">
          <LockKeyhole className="text-primary h-6 w-6" aria-hidden="true" />
          <p className="text-sm font-medium sm:text-base">
            로그인하면 오늘의 수업과 일정을 볼 수 있어요.
          </p>
          <Link
            href="/sign-in"
            className="text-primary font-bold underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </div>
      ) : items.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="tabpanel">
          {items.map((item, index) => (
            <li
              key={`${item.title}-${item.startAt}-${index}`}
              className="bg-surface-blue flex min-h-24 items-center gap-4 rounded-2xl px-5 py-4"
            >
              <span className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-black">{item.title}</p>
                <p className="text-surface-muted mt-1 text-sm tabular-nums">{item.timeRange}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="bg-surface-blue text-surface-muted mt-5 flex min-h-36 items-center justify-center rounded-2xl px-5 text-center text-sm font-medium sm:text-base"
          role="tabpanel"
        >
          오늘 예정된 {tab === 'class' ? '수업' : '일정'}이 없어요.
        </div>
      )}
    </section>
  );
}
