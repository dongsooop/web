'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  MapPin,
  Megaphone,
  Search,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCafeteriaQuery } from '@/features/cafeteria/hooks/useCafeteriaQuery';
import CafeteriaCard from '@/features/home/components/CafeteriaCard';
import { categoryIcon } from '@/features/restaurant/category';
import { useRestaurantQuery } from '@/features/restaurant/hooks/useRestaurantQuery';

const links = [
  { label: '맛집 찾아보기', href: '/restaurants', icon: Search, external: false },
  { label: '도서관', href: 'https://lib.dongyang.ac.kr/', icon: BookOpen, external: true },
  { label: '학사 일정', href: '/schedule', icon: CalendarDays, external: false },
  { label: '학교 소식', href: '/notices', icon: Megaphone, external: false },
] as const;

export default function CampusPageContent() {
  const { isLoggedIn, user } = useAuth();
  const restaurants = useRestaurantQuery('ALL');
  const cafeteria = useCafeteriaQuery({ enabled: !isLoggedIn || !!user?.departmentType });
  const picks = restaurants.items.slice(0, 4);

  return (
    <div className="home-dashboard">
      <header className="home-intro">
        <div>
          <p className="home-date">CAMPUS LIFE</p>
          <h1>
            캠퍼스 생활, 더 가깝게. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">한 끼부터 공부할 공간까지, 캠퍼스의 오늘을 둘러보세요.</p>
        </div>
        <span className="home-semester">동양미래대학교</span>
      </header>

      <nav className="home-quick-links" aria-label="캠퍼스 빠른 메뉴">
        {links.map(({ label, href, icon: Icon, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            <span className="home-quick-icon">
              <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <strong>{label}</strong>
            {external ? (
              <ExternalLink size={15} aria-hidden="true" />
            ) : (
              <ChevronRight size={16} aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>

      <div className="home-main-grid">
        <section className="home-card" aria-labelledby="restaurant-picks-title">
          <div className="home-card-head">
            <h2 id="restaurant-picks-title">학생들이 추천한 맛집</h2>
            <Link href="/restaurants" className="home-more">
              전체 맛집 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {restaurants.isInitialLoading ? (
            <div className="mt-5 grid grid-cols-2 gap-3" aria-hidden="true">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-28 rounded-xl" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : picks.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {picks.map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  href="/restaurants"
                  className="group border-surface-border focus-visible:ring-primary hover:border-primary/30 min-w-0 overflow-hidden rounded-xl border bg-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span
                    className={`flex h-28 items-center justify-center ${index % 2 === 0 ? 'bg-surface-cream' : 'bg-surface-blue'}`}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-sky-700 [&>svg]:h-6 [&>svg]:w-6"
                      aria-hidden="true"
                    >
                      {categoryIcon[restaurant.category]}
                    </span>
                  </span>
                  <span className="block min-w-0 p-3">
                    <strong className="text-bodySm group-hover:text-primary block truncate font-semibold text-black transition-colors">
                      {restaurant.name}
                    </strong>
                    <span className="text-caption text-surface-muted mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {restaurant.category} · {Math.round(restaurant.distance)}m
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-empty">
              {restaurants.displayErrorMessage ?? '아직 등록된 맛집이 없어요.'}
            </div>
          )}

          <div className="border-surface-border mt-5 border-t pt-4">
            <Link href="/restaurants/write" className="home-text-link mt-0">
              내가 아는 맛집 추천하기 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <CafeteriaCard
          menus={cafeteria.data ?? []}
          isLoading={cafeteria.isLoading}
          errorMessage={cafeteria.isError ? cafeteria.displayErrorMessage : null}
        />
      </div>
    </div>
  );
}
