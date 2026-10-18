'use client';

import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Map,
  MapPin,
  Megaphone,
  Search,
  UtensilsCrossed,
} from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCafeteriaQuery } from '@/features/cafeteria/hooks/useCafeteriaQuery';
import CafeteriaCard from '@/features/home/components/CafeteriaCard';
import { categoryIcon } from '@/features/restaurant/category';
import { useRestaurantQuery } from '@/features/restaurant/hooks/useRestaurantQuery';

const CAMPUS_LINKS = [
  {
    title: '캠퍼스 맛집',
    description: '학생들이 추천한 학교 주변 맛집',
    href: '/restaurants',
    icon: UtensilsCrossed,
    tone: 'bg-surface-blue',
    external: false,
  },
  {
    title: '도서관',
    description: '열람실과 스터디룸 확인하기',
    href: 'https://lib.dongyang.ac.kr/',
    icon: BookOpen,
    tone: 'bg-surface-cream',
    external: true,
  },
  {
    title: '학사일정',
    description: '이번 학기 주요 일정 확인하기',
    href: '/schedule',
    icon: CalendarDays,
    tone: 'bg-surface-mint',
    external: false,
  },
  {
    title: '학교 공지',
    description: '새로운 학교와 학과 소식 보기',
    href: '/notices',
    icon: Megaphone,
    tone: 'bg-surface-soft',
    external: false,
  },
] as const;

export default function CampusPageContent() {
  const { isLoggedIn, user } = useAuth();
  const restaurants = useRestaurantQuery('ALL');
  const cafeteria = useCafeteriaQuery({ enabled: !isLoggedIn || !!user?.departmentType });
  const picks = restaurants.items.slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 lg:gap-20">
      <header>
        <p className="text-primary text-sm font-semibold">Campus</p>
        <h1 className="mt-2 text-[2rem] leading-tight font-bold tracking-[-0.035em] text-black sm:text-4xl lg:text-[2.75rem]">
          캠퍼스
        </h1>
        <Link
          href="/restaurants"
          className="bg-surface-soft text-surface-muted hover:bg-gray1 focus-visible:ring-primary mt-8 flex min-h-14 w-full items-center gap-3 rounded-2xl px-5 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:max-w-2xl"
          aria-label="맛집 검색 화면으로 이동"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          맛집 찾아보기
        </Link>
      </header>

      <section aria-labelledby="restaurant-picks-title">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="restaurant-picks-title"
            className="text-2xl font-bold tracking-[-0.025em] text-black sm:text-3xl"
          >
            학생들이 추천한 맛집
          </h2>
          <Link
            href="/restaurants/write"
            className="text-primary hover:bg-surface-blue focus-visible:ring-primary hidden min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            추천하러 가기
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {restaurants.isInitialLoading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <div className="skeleton-base aspect-[4/3] rounded-3xl" />
                <div className="skeleton-base h-5 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        ) : picks.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4">
            {picks.map((restaurant, index) => (
              <Link
                key={restaurant.id}
                href="/restaurants"
                className="group focus-visible:ring-primary min-w-0 rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                <span
                  className={`flex aspect-[4/3] items-center justify-center rounded-3xl ${index % 2 === 0 ? 'bg-surface-cream' : 'bg-surface-blue'}`}
                >
                  <span
                    className="text-primary flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 [&>svg]:h-7 [&>svg]:w-7"
                    aria-hidden="true"
                  >
                    {categoryIcon[restaurant.category]}
                  </span>
                </span>
                <span className="group-hover:text-primary mt-3 block truncate text-base font-bold text-black sm:text-lg">
                  {restaurant.name}
                </span>
                <span className="text-surface-muted mt-1 flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {restaurant.category} · {Math.round(restaurant.distance)}m
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-soft text-surface-muted mt-6 flex min-h-44 items-center justify-center rounded-3xl px-6 text-center">
            {restaurants.displayErrorMessage ?? '아직 등록된 맛집이 없어요.'}
          </div>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)] lg:items-start">
        <CafeteriaCard
          menus={cafeteria.data ?? []}
          isLoading={cafeteria.isLoading}
          errorMessage={cafeteria.isError ? cafeteria.displayErrorMessage : null}
        />

        <section aria-labelledby="campus-life-title">
          <div className="flex items-center gap-3">
            <Map className="text-primary h-6 w-6" aria-hidden="true" />
            <h2
              id="campus-life-title"
              className="text-2xl font-bold tracking-[-0.025em] text-black"
            >
              캠퍼스 생활
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CAMPUS_LINKS.map(({ title, description, href, icon: Icon, tone, external }) => (
              <Link
                key={title}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`${tone} group focus-visible:ring-primary flex min-h-36 items-center gap-4 rounded-3xl p-5 transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none`}
              >
                <span className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="group-hover:text-primary block text-lg font-bold text-black">
                    {title}
                  </span>
                  <span className="text-surface-muted mt-1 block text-sm leading-6">
                    {description}
                  </span>
                </span>
                <ChevronRight
                  className="text-surface-muted ml-auto h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
