'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import CommonTag from '@/components/ui/CommonTag';
import { Divider } from '@/components/ui/Divider';
import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
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
    <article className="group flex flex-col gap-2 bg-white sm:px-2">
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 cursor-pointer flex-col gap-4 py-2 transition"
        aria-label={`${notice.tags.map((tag) => tag.label).join(' ')} ${notice.title}`}
      >
        <h3 className="text-body font-semibold break-words text-black underline-offset-2 group-hover:underline">
          {notice.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {notice.tags.map((tag, idx) => (
            <CommonTag key={`${tag.label}-${idx}`} label={tag.label} tone={tag.tone} />
          ))}
        </div>
      </a>
    </article>
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
    isInitialLoading,
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
  const canExpand = !isExpanded && items.length > initialCount;
  const showMoreButton = canExpand || hasMore;
  const visibleItems = isExpanded ? items : items.slice(0, initialCount);

  if (isError) {
    return (
      <div className="max-w-content mx-auto flex min-h-[60vh] w-full items-center justify-center px-4 text-center">
        <p className="text-body text-gray5">{displayErrorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto flex w-full flex-col gap-4">
      <PageHeader
        title="공지"
        description="최신 학교 공지와 학과 공지를 빠르게 확인할 수 있어요."
        backHref="/"
        backLabel="홈으로 돌아가기"
      />

      <section className="border-gray2 rounded-xl border bg-white" aria-label="공지 목록">
        <div className="border-gray2 border-b">
          <div className="flex" role="tablist" aria-label="공지 분류">
            {TABS.map((it) => {
              const active = it.id === currentTab;

              return (
                <button
                  key={it.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (it.id === 'DEPARTMENT' && !isLoggedIn) {
                      openLoginDialog();
                      return;
                    }

                    setTab(it.id);
                    setIsExpanded(false);
                  }}
                  className={[
                    'text-bodySm flex h-12 min-h-14 w-16 flex-none cursor-pointer items-center justify-center border-b-2 font-semibold transition sm:w-18',
                    active
                      ? 'border-primary text-primary'
                      : 'text-gray5 border-transparent hover:text-black',
                  ].join(' ')}
                >
                  <span className="block px-4">{it.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`px-4 ${
            isExpanded ? `${EXPANDED_LIST_HEIGHT} overflow-y-auto` : 'overflow-visible'
          }`}
        >
          {isInitialLoading ? (
            <Skeleton className="my-4 h-[44rem] rounded-xl sm:h-[46rem]" />
          ) : (
            <div className="py-4">
              {visibleItems.length > 0 ? (
                <ul>
                  {visibleItems.map((notice, index) => (
                    <li key={`${notice.type}-${notice.id}`}>
                      <NoticeCard notice={notice} />
                      {index < visibleItems.length - 1 ? <Divider /> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-body text-gray5 flex min-h-56 items-center justify-center px-6 text-center">
                  <p>선택한 분류의 공지가 아직 없어요.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="my-6 flex justify-center">
          {showMoreButton ? (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(true);

                if (hasMore) {
                  void fetchNextPage();
                }
              }}
              disabled={isFetchingNextPage}
              className="border-gray2 text-bodySm hover:border-primary/20 hover:bg-primary/5 disabled:text-gray5 inline-flex min-h-12 min-w-45 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-6 font-semibold text-black transition disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? '불러오는 중...' : '더보기'}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
