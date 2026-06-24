'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';

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
  const bodyText = menus[index] || '식단 정보가 없습니다.';

  return (
    <Card className="min-h-11 gap-4 lg:h-full">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90"
          aria-label="이전 식단"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-body font-bold text-black">{title}</span>

        <button
          onClick={handleNext}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:scale-90"
          aria-label="이후 식단"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="min-h-20">
        <p className="text-body line-clamp-3 leading-relaxed break-words text-black">{bodyText}</p>
      </div>
    </Card>
  );
}
