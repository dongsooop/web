'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';

const NAV = [
  { href: '/home', label: '홈' },
  { href: '/board', label: '게시판' },
  { href: '/chat', label: '채팅' },
  { href: '/my-page', label: '마이페이지' },
];

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isInitialized, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/sign-in');
    } catch {
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-gray2 sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2">
          <Image src="/img/logo.svg" alt="Dongsoop" width={28} height={28} priority />
          <span className="text-large font-semibold text-black">Dongsoop</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:hidden">
          {NAV.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'text-normal font-regular border-b-2 pb-1 transition-colors duration-200',
                  active
                    ? 'border-primary text-primary'
                    : 'hover:text-primary border-transparent text-black',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center">
          {!isInitialized ? (
            <div className="inline-flex min-h-[40px] items-center justify-center px-3 text-sm text-gray-400">
              ...
            </div>
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-normal hover:bg-gray1 inline-flex min-h-[40px] items-center justify-center rounded-lg px-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="text-normal hover:bg-gray1 inline-flex min-h-[40px] items-center justify-center rounded-lg px-3 font-semibold text-black"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
