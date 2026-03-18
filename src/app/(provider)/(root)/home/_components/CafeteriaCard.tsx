'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCafeteriaQuery } from '@/features/cafeteria/hooks/useCafeteriaQuery';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function CafeteriaCard() {
  const { data: menus = [], isLoading, displayErrorMessage: errorText } = useCafeteriaQuery();
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const [index, setIndex] = useState(() => todayIndex);

  const handlePrev = () => setIndex((p) => (p === 0 ? 6 : p - 1));
  const handleNext = () => setIndex((p) => (p === 6 ? 0 : p + 1));

  const title = index === todayIndex ? '오늘의 학식' : `${DAY_LABELS[index]}요일 학식`;

  const bodyText = useMemo(() => {
    if (isLoading) return '식단을 불러오고 있습니다...';
    if (errorText) return errorText;

    return menus[index] || '식단 정보가 없습니다.';
  }, [isLoading, errorText, menus, index]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={isLoading || !!errorText}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90 disabled:invisible"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-normal font-bold text-black">{errorText ? '오류 발생' : title}</span>

        <button
          onClick={handleNext}
          disabled={isLoading || !!errorText}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90 disabled:invisible"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 flex min-h-[3.5rem] items-start">
        <p
          className={`text-normal line-clamp-2 leading-relaxed ${
            isLoading ? 'animate-pulse' : 'text-black'
          }`}
        >
          {bodyText}
        </p>
      </div>
    </div>
  );
}
