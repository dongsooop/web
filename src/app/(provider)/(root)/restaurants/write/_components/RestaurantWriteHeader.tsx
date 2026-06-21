'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function RestaurantWriteHeader() {
  return (
    <div className="max-w-timetable-content mx-auto flex w-full flex-col gap-2 px-4 pt-1 pb-5 sm:px-6 lg:px-8">
      <div className="flex items-start gap-3">
        <Link
          href="/restaurants"
          className="hover:bg-gray1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
          aria-label="맛집 목록으로 돌아가기"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </Link>

        <div className="min-w-0 pt-1">
          <h1 className="text-heading sm:text-title font-bold text-black">학교 근처 맛집 추천</h1>
          <p className="text-bodySm text-gray5 sm:text-body mt-2">
            학교 주변 식당 정보를 모아보고 비교할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
