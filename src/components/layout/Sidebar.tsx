'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, User } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const NAV: NavItem[] = [
  { label: '홈', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: '캠퍼스', href: '/campus', icon: <Map className="h-5 w-5" /> },
  { label: '마이페이지', href: '/mypage', icon: <User className="h-5 w-5" /> },
];

export function isNavActive(pathname: string, href: string) {
  if (href === '/mypage') {
    return (
      pathname === href ||
      pathname.startsWith('/mypage/') ||
      pathname === '/schedule' ||
      pathname.startsWith('/schedule/') ||
      pathname === '/timetable' ||
      pathname.startsWith('/timetable/')
    );
  }

  if (href === '/') {
    return (
      pathname === href ||
      pathname.startsWith('/home') ||
      pathname.startsWith('/notices') ||
      pathname.startsWith('/eclass')
    );
  }

  if (href === '/campus') {
    return (
      pathname === href || pathname.startsWith('/campus/') || pathname.startsWith('/restaurants')
    );
  }

  return pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-surface-border sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 border-r bg-white lg:flex">
      <div className="flex w-full flex-col px-4 py-8">
        <p className="text-surface-muted mb-4 px-3 text-xs font-semibold tracking-[0.12em] uppercase">
          Campus life
        </p>
        <nav className="flex w-full flex-col gap-2" aria-label="주요 메뉴">
          {NAV.map((item) => {
            const active = isNavActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group focus-visible:ring-primary relative flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  active ? 'bg-primary/10 text-primary' : 'text-gray6 hover:bg-surface-soft'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl">
                  {item.icon}
                </div>

                <div className="text-sm font-semibold">{item.label}</div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pb-2" />
      </div>
    </aside>
  );
}
