'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, isReady, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <header className="border-gray2 sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/logo.svg" alt="Dongsoop" width={28} height={28} priority />
          <span className="text-large font-semibold text-black">Dongsoop</span>
        </Link>

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
  );
}
