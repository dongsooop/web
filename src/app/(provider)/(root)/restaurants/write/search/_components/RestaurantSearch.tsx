'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useRestaurantSearch } from '@/features/restaurant/hooks/useRestaurantSearch';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';

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
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');

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

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col py-4">
      <div className="mx-auto w-full">
        <div className="mx-auto flex w-full flex-col gap-4 pb-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/restaurants/write"
              className="hover:bg-gray1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="맛집 추천 화면으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </Link>

            <h1 className="text-heading sm:text-title font-bold text-black">학교 근처 맛집 검색</h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <label className="border-gray2 flex h-11 w-full items-center rounded-2xl border bg-white px-5">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="가게를 검색해주세요"
                className="text-heading placeholder:text-gray5 w-full bg-transparent text-black outline-none"
                enterKeyHint="search"
                autoFocus
              />
            </label>
          </form>

          {displayErrorMessage ? (
            <p className="text-caption text-warning-100 whitespace-pre-line">
              {displayErrorMessage}
            </p>
          ) : null}

          <div className="flex flex-col">
            {items.map((restaurant) => (
              <button
                key={restaurant.externalMapId}
                type="button"
                onClick={() => router.push(buildWriteUrl(restaurant))}
                className="border-gray2 flex h-20 cursor-pointer items-center gap-4 border-b text-left"
              >
                <MapPin className="text-gray5 h-6 w-6 shrink-0" />

                <div className="min-w-0">
                  <h2 className="text-body sm:text-heading font-semibold text-black">
                    {restaurant.name}
                  </h2>
                  <p className="text-bodySm text-gray5 mt-1 truncate">{restaurant.address}</p>
                </div>
              </button>
            ))}

            {showEmptyState ? (
              <div className="py-10 text-center">
                <p className="text-bodySm text-gray5">검색 결과가 없어요.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
