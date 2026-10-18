'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CafeteriaSkeleton from './CafeteriaSkeleton';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

type CafeteriaCardProps = {
  menus: string[];
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function CafeteriaCard({
  menus,
  isLoading = false,
  errorMessage = null,
}: CafeteriaCardProps) {
  const getTodayIndex = () => (new Date().getDay() + 6) % 7;
  const todayIndex = getTodayIndex();
  const [index, setIndex] = useState(getTodayIndex);

  if (isLoading) {
    return <CafeteriaSkeleton />;
  }

  const handlePrev = () => setIndex((p) => (p === 0 ? 6 : p - 1));
  const handleNext = () => setIndex((p) => (p === 6 ? 0 : p + 1));

  const title = index === todayIndex ? '오늘의 학식' : `${DAY_LABELS[index]}요일 학식`;
  const bodyText = menus[index] || '식단 정보가 없습니다.';

  return (
    <section aria-labelledby="cafeteria-title">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="hover:bg-surface-soft focus-visible:ring-primary flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="이전 식단"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <h2 id="cafeteria-title" className="text-2xl font-bold tracking-[-0.025em] text-black">
          {title}
        </h2>

        <button
          onClick={handleNext}
          className="hover:bg-surface-soft focus-visible:ring-primary flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="이후 식단"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="border-surface-border mt-5 min-h-48 border-l-4 py-2 pl-5 sm:pl-7">
        {errorMessage ? (
          <div className="flex min-h-20 items-center justify-center text-center">
            <p className="text-body text-surface-muted whitespace-pre-line">{errorMessage}</p>
          </div>
        ) : (
          <p className="text-base leading-8 font-semibold break-words text-black">{bodyText}</p>
        )}
      </div>
    </section>
  );
}
