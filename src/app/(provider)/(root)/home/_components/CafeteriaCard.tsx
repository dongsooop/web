'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CafeteriaCardProps = {
  menuByDay?: string[];
  dayLabels?: string[];
  initialDayIndex?: number;

  isLoading?: boolean;
  errorText?: string;
};

const DEFAULT_DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const DEFAULT_MENUS = [
  '백미밥, 우삼겹숙주볶음, 두부양념조림, 유채겉절이, 배추김치, 요구르트, 김치손만두국',
  '백미밥, 오리주물럭, 열무비빔국수, 청포묵김가루무침, 배추김치, 요구르트, 시금치된장국',
  '백미밥, 떡갈비구이&데리마요, 알리오올리오, 오징어젓무침, 배추김치, 요구르트, 순두부찌개',
  '백미밥, 고추장제육콩나물불고기, 감자채볶음, 브로콜리된장마요무침, 배추김치, 요구르트, 황태달걀국',
  '백미밥, 돈까스유린기, 어묵볶음, 콩나물부추무침, 배추김치, 요구르트, 유부김치우동',
  '휴무',
  '휴무',
];

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function CafeteriaCard({
  menuByDay,
  dayLabels,
  initialDayIndex,
  isLoading = false,
  errorText,
}: CafeteriaCardProps) {
  const labels = dayLabels ?? DEFAULT_DAY_LABELS;
  const menus = menuByDay ?? DEFAULT_MENUS;

  const len = menus.length;
  const hasPages = len > 0;
  const isInteractive = hasPages && !isLoading && !errorText;
  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return (jsDay + 6) % 7;
  }, []);

  const safeInitial = useMemo(() => {
    if (!hasPages) return 0;
    const base = typeof initialDayIndex === 'number' ? initialDayIndex : todayIndex;
    return clamp(base, 0, len - 1);
  }, [hasPages, initialDayIndex, todayIndex, len]);

  const [index, setIndex] = useState(safeInitial);

  const prev = () => {
    if (!isInteractive) return;
    setIndex((p) => (p - 1 + len) % len);
  };

  const next = () => {
    if (!isInteractive) return;
    setIndex((p) => (p + 1) % len);
  };

  const title = index === todayIndex ? '오늘의 학식' : `${labels[index] ?? ''}요일 학식`;

  const bodyText = isLoading
    ? '불러오는 중...'
    : errorText
      ? errorText
      : !hasPages
        ? '학식이 제공되지 않아요!'
        : menus[index];

  return (
    <div className="border-gray2 h-full rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={!isInteractive}
          className="hover:border-gray2 hover:bg-gray1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full disabled:opacity-50"
          aria-label="이전"
        >
          <ChevronLeft className="text-gray3 h-5 w-5" aria-hidden />
        </button>

        <span className="text-normal font-bold text-black">{title}</span>

        <button
          type="button"
          onClick={next}
          disabled={!isInteractive}
          className="hover:border-gray2 hover:bg-gray1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full disabled:opacity-50"
          aria-label="다음"
        >
          <ChevronRight className="text-gray3 h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-2 h-12">
        <p className="text-normal text-gray4 line-clamp-2 leading-5">{bodyText}</p>
      </div>
    </div>
  );
}
