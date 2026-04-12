'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

type CafeteriaCardProps = {
  menus: string[];
};

export default function CafeteriaCard({ menus }: CafeteriaCardProps) {
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const [index, setIndex] = useState(() => todayIndex);

  const handlePrev = () => setIndex((p) => (p === 0 ? 6 : p - 1));
  const handleNext = () => setIndex((p) => (p === 6 ? 0 : p + 1));

  const title = index === todayIndex ? '오늘의 학식' : `${DAY_LABELS[index]}요일 학식`;
  const bodyText = useMemo(() => menus[index] || '식단 정보가 없습니다.', [menus, index]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90"
          aria-label="이전 식단"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-normal font-bold text-black">{title}</span>

        <button
          onClick={handleNext}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90"
          aria-label="이후 식단"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 flex min-h-[3.5rem] items-start">
        <p className="text-normal line-clamp-2 leading-relaxed text-black">{bodyText}</p>
      </div>
    </div>
  );
}
