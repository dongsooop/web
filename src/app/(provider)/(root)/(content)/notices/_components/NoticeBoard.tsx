'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Megaphone } from 'lucide-react';

import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLoginRequiredDialog } from '@/features/auth/hooks/useLoginRequiredDialog';
import { useNoticeQuery } from '@/features/notice/hooks/useNoticeQuery';
import type { NoticeTab, NoticeUiItem } from '@/features/notice/types/ui-model';

const tabs: { id: NoticeTab; label: string }[] = [
  { id: 'ALL', label: '전체 공지' },
  { id: 'OFFICIAL', label: '학교 공지' },
  { id: 'DEPARTMENT', label: '학과 공지' },
];

const mobileCount = 5;
const desktopCount = 7;

function NoticeRow({ notice }: { notice: NoticeUiItem }) {
  const isOfficial = notice.type === 'OFFICIAL';

  return (
    <li className="border-surface-border border-b last:border-b-0">
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group focus-visible:ring-primary hover:bg-surface-soft flex min-h-28 items-center gap-4 rounded-lg px-1 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3"
        aria-label={`${notice.title}, ${notice.dateLabel}, 새 창에서 열기`}
      >
        <span
          className={`text-caption inline-flex shrink-0 items-center rounded-md px-2 py-1 font-semibold ${
            isOfficial ? 'bg-surface-blue text-sky-700' : 'bg-gray7 text-surface-muted'
          }`}
        >
          {isOfficial ? '학교' : '학과'}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-caption text-surface-muted font-semibold">
              {notice.tags.map((tag) => tag.label).join(' · ')}
            </span>
          </span>
          <h3 className="text-bodySm group-hover:text-primary sm:text-body line-clamp-2 font-semibold text-black transition-colors">
            {notice.title}
          </h3>
          <span className="text-caption text-surface-muted flex flex-wrap items-center gap-x-2">
            <span>{notice.writer}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={notice.createdAt}>{notice.dateLabel}</time>
          </span>
        </div>
        <ArrowUpRight
          className="text-gray5 group-hover:text-primary h-4 w-4 shrink-0 transition-colors"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

function NoticeSkeleton() {
  return (
    <div className="divide-surface-border divide-y" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex min-h-28 items-center gap-4 py-5">
          <Skeleton className="h-7 w-12 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NoticeBoard() {
  const { isLoggedIn } = useAuth();
  const openLoginDialog = useLoginRequiredDialog();
  const [tab, setTab] = useState<NoticeTab>('ALL');
  const [visiblePage, setVisiblePage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const currentTab = !isLoggedIn && tab === 'DEPARTMENT' ? 'ALL' : tab;
  const {
    items,
    hasMore,
    isInitialLoading,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
    displayErrorMessage,
  } = useNoticeQuery(currentTab);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  const initialCount = isMobile ? mobileCount : desktopCount;
  const visibleCount = visiblePage * initialCount;
  const showMore = items.length > visibleCount || hasMore;
  const visibleItems = items.slice(0, visibleCount);
  const loadMoreError = isFetchNextPageError ? displayErrorMessage : null;

  const selectTab = (next: NoticeTab) => {
    if (next === 'DEPARTMENT' && !isLoggedIn) {
      openLoginDialog();
      return;
    }

    setTab(next);
    setVisiblePage(1);
  };

  const loadMore = async () => {
    const nextCount = (visiblePage + 1) * initialCount;

    if (items.length < nextCount && hasMore) {
      const result = await fetchNextPage();
      if (result.isError) return;
    }

    setVisiblePage((page) => page + 1);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="home-intro">
        <div>
          <p className="home-date">CAMPUS UPDATES</p>
          <h1>
            학교 소식, 한눈에. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">학교와 학과의 새로운 공지를 한곳에서 확인해요.</p>
        </div>
        <span className="home-semester">학교 · 학과 공지</span>
      </header>

      <section className="home-card flex flex-col gap-0" aria-labelledby="notice-title">
        <div className="home-card-head mb-4">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <Megaphone className="h-5 w-5" />
            </span>
            <h2 id="notice-title">새로운 공지</h2>
          </div>
          <span className="text-caption text-surface-muted font-semibold">최신순</span>
        </div>

        <div
          className="border-surface-border flex gap-5 border-b"
          role="tablist"
          aria-label="공지 분류"
        >
          {tabs.map(({ id, label }) => {
            const active = id === currentTab;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(id)}
                className={`text-bodySm focus-visible:ring-primary relative min-h-12 cursor-pointer px-1 font-semibold transition-colors focus-visible:rounded-md focus-visible:ring-2 focus-visible:outline-none ${
                  active ? 'text-primary' : 'text-surface-muted hover:text-black'
                }`}
              >
                {label}
                {active ? (
                  <span className="bg-primary absolute inset-x-0 bottom-0 h-0.5 rounded-full" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div>
          {isInitialLoading ? (
            <NoticeSkeleton />
          ) : isError && items.length === 0 ? (
            <div
              className="text-bodySm text-surface-muted flex min-h-56 items-center justify-center px-4 text-center"
              role="alert"
            >
              {displayErrorMessage}
            </div>
          ) : visibleItems.length > 0 ? (
            <ul>
              {visibleItems.map((notice) => (
                <NoticeRow key={`${notice.type}-${notice.id}`} notice={notice} />
              ))}
            </ul>
          ) : (
            <div className="text-bodySm text-surface-muted flex min-h-56 items-center justify-center px-4 text-center">
              선택한 분류의 공지가 아직 없어요.
            </div>
          )}
        </div>

        {showMore || loadMoreError ? (
          <div className="border-surface-border flex flex-col items-center gap-3 border-t pt-6">
            {loadMoreError ? (
              <p className="text-caption text-warning-100 text-center" role="alert">
                공지를 더 불러오지 못했어요. 다시 시도해주세요.
              </p>
            ) : null}
            {showMore ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={isFetchingNextPage}
                className="border-surface-border text-bodySm hover:border-primary hover:bg-surface-blue focus-visible:ring-primary inline-flex min-h-12 min-w-40 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-6 font-semibold text-black transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? '불러오는 중...' : loadMoreError ? '다시 시도' : '더보기'}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
