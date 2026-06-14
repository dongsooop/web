'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import CommonTag from '@/components/ui/CommonTag';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLoginRequiredDialog } from '@/features/auth/hooks/useLoginRequiredDialog';
import { useNoticeQuery } from '@/features/notice/hooks/useNoticeQuery';
import type { NoticeTab, NoticeUiItem } from '@/features/notice/types/ui-model';

const TABS = [
  { id: 'ALL', label: '전체' },
  { id: 'OFFICIAL', label: '학교' },
  { id: 'DEPARTMENT', label: '학과' },
] as const;

const MOBILE_COUNT = 5;
const DESKTOP_COUNT = 7;
const EXPANDED_LIST_HEIGHT = 'max-h-notice-mobile sm:max-h-notice-desktop';

function NoticeCard({ notice }: { notice: NoticeUiItem }) {
  return (
    <Link
      href={notice.link}
      target="_blank"
      rel="noopener noreferrer"
      className="border-gray2 hover:border-primary/20 group flex min-h-24 cursor-pointer flex-col gap-3 rounded-3xl border bg-white px-4 py-4 transition sm:px-5"
    >
      <div className="flex flex-wrap gap-2">
        {notice.tags.map((tag, idx) => (
          <CommonTag key={`${tag.label}-${idx}`} label={tag.label} tone={tag.tone} />
        ))}
      </div>

      <p className="text-body line-clamp-2 font-semibold text-black underline-offset-2 group-hover:underline">
        {notice.title}
      </p>
    </Link>
  );
}

export default function NoticeBoard() {
  const { isLoggedIn } = useAuth();
  const openLoginDialog = useLoginRequiredDialog();
  const [tab, setTab] = useState<NoticeTab>('ALL');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const currentTab = !isLoggedIn && tab === 'DEPARTMENT' ? 'ALL' : tab;
  const {
    items,
    hasMore,
    isLoading,
    isError,
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

  const initialCount = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
  const visibleItems = isExpanded ? items : items.slice(0, initialCount);

  if (isError) {
    return (
      <div className="max-w-layout mx-auto flex min-h-[60vh] w-full items-center justify-center px-4 text-center">
        <p className="text-body text-gray5">{displayErrorMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-notice mx-auto w-full px-3 pt-3 pb-6 sm:px-4">
        <div className="rounded-timetable flex flex-col bg-white px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-heading sm:text-title font-bold text-black">공지</h1>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                <p className="text-gray6 text-sm sm:text-base">
                  최신 학교 공지와 학과 공지를 빠르게 확인할 수 있어요.
                </p>

                <div className="hidden flex-none sm:block sm:w-90" aria-hidden="true" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pb-3">
              {TABS.map((it) => {
                const active = it.id === currentTab;

                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => {
                      if (it.id === 'DEPARTMENT' && !isLoggedIn) {
                        openLoginDialog();
                        return;
                      }

                      setTab(it.id);
                      setIsExpanded(false);
                    }}
                    className={`text-bodySm relative inline-flex h-11 min-w-5 cursor-pointer items-center justify-center px-2 pb-2 font-semibold transition ${
                      active ? 'text-primary' : 'text-gray6 hover:text-black'
                    }`}
                  >
                    <span
                      className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition ${
                        active ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col pt-4">
            <section
              className={`pr-1 ${isExpanded ? `${EXPANDED_LIST_HEIGHT} overflow-y-auto` : 'overflow-visible'}`}
            >
              <div className="flex flex-col gap-3 pb-6">
                {isLoading ? (
                  Array.from({ length: initialCount }).map((_, idx) => (
                    <div key={idx} className="skeleton-base h-24 rounded-3xl" />
                  ))
                ) : visibleItems.length > 0 ? (
                  visibleItems.map((notice) => (
                    <NoticeCard key={`${notice.link}-${notice.title}`} notice={notice} />
                  ))
                ) : (
                  <div className="border-gray2 flex min-h-56 items-center justify-center rounded-3xl border bg-white px-6 text-center">
                    <p className="text-body text-gray5">선택한 분류의 공지가 아직 없어요.</p>
                  </div>
                )}
              </div>
            </section>

            <div className="flex justify-center pt-3 pb-1">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(true);
                    void fetchNextPage();
                  }}
                  disabled={isFetchingNextPage}
                  className="border-gray2 text-bodySm hover:border-primary/20 hover:bg-primary/5 disabled:text-gray5 inline-flex min-h-12 min-w-45 cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-white px-6 font-semibold text-black transition disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? '불러오는 중...' : '더보기'}
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
