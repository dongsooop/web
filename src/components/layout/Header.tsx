'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { NAV } from './Sidebar';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isReady, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // client store는 이미 정리되었을 수 있으므로, 서버 상태를 다시 확인해 맞춘다.
    } finally {
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="border-gray2 sticky top-0 z-40 w-full border-b bg-white">
        <div className="flex h-14 w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="hover:bg-gray1 inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-global-nav"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <Image src="/img/logo.svg" alt="Dongsoop" width={28} height={28} priority />
              <span className="text-large font-semibold text-black">Dongsoop</span>
            </Link>
          </div>

          <div className="flex items-center">
            {!isReady ? (
              <div className="inline-flex min-h-[44px] items-center justify-center px-3 text-sm text-gray-400">
                ...
              </div>
            ) : isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-normal hover:bg-gray1 inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="text-normal hover:bg-gray1 inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 font-semibold text-black"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 lg:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-global-nav"
        aria-label="모바일 메뉴"
        className={`fixed inset-y-0 left-0 z-[60] flex w-[280px] max-w-[82vw] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-gray2 flex h-14 items-center justify-between border-b px-4">
          <div className="text-normal font-semibold text-black">메뉴</div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="hover:bg-gray1 inline-flex h-11 w-11 items-center justify-center rounded-lg"
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 ${
                  active ? 'bg-primary/10 text-primary' : 'text-gray6 hover:bg-gray1'
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center">{item.icon}</span>
                <span className="text-normal font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
