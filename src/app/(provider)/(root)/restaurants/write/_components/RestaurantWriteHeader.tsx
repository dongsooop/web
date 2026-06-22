'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function RestaurantWriteHeader() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Link
            href="/restaurants"
            className="hover:bg-gray1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="맛집 목록으로 돌아가기"
          >
            <ArrowLeft className="h-5 w-5 text-black" />
          </Link>

          <h1 className="text-heading sm:text-title min-w-0 font-bold text-black">
            학교 근처 맛집 추천
          </h1>
        </div>

        <p className="text-bodySm text-gray6 sm:text-body px-2">
          동미대 학생들에게 추천할 맛집 정보를 입력해주세요
        </p>
      </div>
    </div>
  );
}
