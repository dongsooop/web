'use client';

import { MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import { checkDuplication } from '@/features/restaurant/client/restaurant.api';
import { useRestaurantSearch } from '@/features/restaurant/hooks/useRestaurantSearch';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { useToastStore } from '@/store/useToastStore';

function buildWriteUrl(restaurant: RestaurantSearchItem) {
  const query = new URLSearchParams({
    externalMapId: restaurant.externalMapId,
    name: restaurant.name,
    address: restaurant.address,
    placeUrl: restaurant.placeUrl,
    distance: String(restaurant.distance),
  });

  return `/restaurants/write?${query.toString()}`;
}

export default function RestaurantSearch() {
  const router = useRouter();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const showToast = useToastStore((state) => state.showToast);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  const { items, isFetching, displayErrorMessage } = useRestaurantSearch(debouncedKeyword);
  const showEmptyState =
    !!submittedKeyword &&
    submittedKeyword === debouncedKeyword.trim() &&
    !isFetching &&
    !items.length;

  function submitSearch() {
    setSubmittedKeyword(keyword.trim());
  }

  function clearKeyword() {
    setKeyword('');
    setDebouncedKeyword('');
    setSubmittedKeyword('');
  }

  async function selectRestaurant(restaurant: RestaurantSearchItem) {
    if (checkingId) {
      return;
    }

    if (!isInitialized) {
      showToast('앱 인증 준비 중이에요. 잠시 후 다시 시도해주세요.', 'error');
      return;
    }

    setCheckingId(restaurant.externalMapId);

    try {
      const result = await checkDuplication(restaurant.externalMapId);

      if (result.isDuplicate) {
        showToast('이미 등록된 맛집이에요.', 'error');
        return;
      }

      router.push(buildWriteUrl(restaurant));
    } catch (error: unknown) {
      showToast(getErrorMessage('restaurant', error, 'duplicate'), 'error');
    } finally {
      setCheckingId(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col py-4">
      <div className="max-w-content mx-auto w-full">
        <div className="mx-auto flex w-full flex-col gap-4 pb-5 sm:px-6 lg:px-8">
          <PageHeader
            title="학교 근처 맛집 검색"
            showBackButton
            description="추천할 가게를 검색해주세요"
          />

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <label className="border-gray2 flex h-11 w-full items-center rounded-2xl border bg-white px-5">
              <span className="sr-only">가게 검색</span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="가게를 검색해주세요"
                aria-label="가게 검색"
                className="text-heading placeholder:text-gray5 w-full bg-transparent text-black outline-none"
                enterKeyHint="search"
                autoFocus
              />

              {keyword ? (
                <button
                  type="button"
                  onClick={clearKeyword}
                  className="text-gray5 flex h-11 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:text-black"
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </label>
          </form>

          {displayErrorMessage ? (
            <p className="text-caption text-warning-100 whitespace-pre-line" role="alert">
              {displayErrorMessage}
            </p>
          ) : null}

          <section aria-label="맛집 검색 결과">
            {items.length > 0 ? (
              <ul>
                {items.map((restaurant) => (
                  <li key={restaurant.externalMapId}>
                    <button
                      type="button"
                      onClick={() => {
                        void selectRestaurant(restaurant);
                      }}
                      disabled={checkingId === restaurant.externalMapId}
                      className="border-gray2 flex h-20 w-full cursor-pointer items-center gap-4 border-b text-left disabled:cursor-default disabled:opacity-60"
                    >
                      <MapPin className="text-gray5 h-6 w-6 shrink-0" aria-hidden="true" />

                      <div className="min-w-0">
                        <p className="text-body sm:text-heading font-semibold text-black">
                          {restaurant.name}
                        </p>
                        <p className="text-bodySm text-gray5 mt-1 truncate">{restaurant.address}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {showEmptyState ? (
              <div className="py-10 text-center">
                <p className="text-bodySm text-gray5">검색 결과가 없어요.</p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
