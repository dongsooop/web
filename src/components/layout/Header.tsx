'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/features/auth/hooks/useAuth';

const LOGOUT_DELAY = 2000;
const LOGOUT_FADE_DELAY = 250;

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isReady, user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const start = Date.now();

    try {
      await logout();
    } catch {
    } finally {
      const remain = LOGOUT_DELAY - (Date.now() - start);

      if (remain > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remain));
      }

      if (pathname.startsWith('/schedule') || pathname.startsWith('/timetable')) {
        router.replace('/mypage');
      } else {
        router.refresh();
      }

      window.setTimeout(() => {
        setIsLoggingOut(false);
      }, LOGOUT_FADE_DELAY);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-brand" aria-label="동숲 홈">
            <Image src="/img/logo.svg" alt="" width={29} height={29} priority />
            <strong>동숲</strong>
            <span>
              우리의 캠퍼스, 더<br />
              가깝게.
            </span>
          </Link>
          <nav className="site-nav" aria-label="주요 메뉴">
            <Link
              href="/"
              className={pathname === '/' || pathname.startsWith('/home') ? 'active' : ''}
            >
              오늘
            </Link>
            <Link href="/notices" className={pathname.startsWith('/notices') ? 'active' : ''}>
              학교 소식
            </Link>
            <Link
              href="/timetable"
              className={
                pathname.startsWith('/timetable') || pathname.startsWith('/schedule')
                  ? 'active'
                  : ''
              }
            >
              내 학업
            </Link>
            <Link
              href="/campus"
              className={
                pathname.startsWith('/campus') || pathname.startsWith('/restaurants')
                  ? 'active'
                  : ''
              }
            >
              캠퍼스 생활
            </Link>
          </nav>
          <div className="site-actions">
            <Link href="/search" className="site-search" aria-label="검색">
              <Search size={18} aria-hidden="true" />
            </Link>
            {!isReady ? (
              <span className="site-user">불러오는 중</span>
            ) : isLoggedIn ? (
              <div className="site-account">
                <Link href="/mypage" className="site-user">
                  <span className="site-avatar">{user?.nickname?.slice(0, 1) || '동'}</span>
                  {user?.nickname || '마이페이지'} <ChevronDown size={14} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="site-logout"
                >
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            ) : (
              <Link href="/sign-in" className="site-user">
                <span className="site-avatar">동</span> 로그인{' '}
                <ChevronDown size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {isLoggingOut ? (
        <div className="border-gray2 fixed inset-x-0 top-[76px] bottom-0 z-[80] border-t bg-white max-[700px]:top-[60px]">
          <LoadingScreen message="로그아웃 중이에요." fill />
        </div>
      ) : null}
    </>
  );
}
