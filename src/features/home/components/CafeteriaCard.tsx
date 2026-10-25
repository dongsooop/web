'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CafeteriaSkeleton from './CafeteriaSkeleton';

const days = ['월', '화', '수', '목', '금', '토', '일'];
const todayIndex = () => (new Date().getDay() + 6) % 7;

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
  const [index, setIndex] = useState(todayIndex);
  const title = index === todayIndex() ? '오늘의 학식' : `${days[index]}요일 학식`;

  if (isLoading) return <CafeteriaSkeleton />;

  return (
    <section className="home-card home-lunch" aria-labelledby="cafeteria-title">
      <div className="home-card-head">
        <h2 id="cafeteria-title">{title}</h2>
        <div className="home-lunch-controls">
          <button
            type="button"
            onClick={() => setIndex((day) => (day + 6) % 7)}
            aria-label="이전 식단"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((day) => (day + 1) % 7)}
            aria-label="다음 식단"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="home-lunch-art">
        <span className="home-plate" aria-hidden="true">
          <span />
        </span>
        <span>CAMPUS LUNCH</span>
      </div>
      <div className="home-lunch-copy">
        <span className="home-eyebrow">
          {index === todayIndex() ? '오늘의 메뉴' : `${days[index]}요일 메뉴`}
        </span>
        <strong>{errorMessage || menus[index] || '식단 정보가 없습니다.'}</strong>
        <small>운영 시간과 메뉴는 학교 사정에 따라 달라질 수 있어요.</small>
      </div>
      <Link href="/restaurants" className="home-text-link">
        학교 근처 맛집도 둘러보기 <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </section>
  );
}
