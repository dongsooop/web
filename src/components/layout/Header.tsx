'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  const [open, setOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', onKeyDown);
      };
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <>
      <header className="border-gray2 sticky top-0 z-40 w-full border-b bg-white">
        <div className="flex h-14 w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hover:bg-gray1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full active:scale-[0.98] md:hidden"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5 text-black" aria-hidden />
            </button>

            <Link href="/home" className="flex items-center gap-2">
              <Image src="/img/logo.svg" alt="Dongsoop" width={28} height={28} priority />
              <span className="text-large font-semibold text-black">Dongsoop</span>
            </Link>
          </div>

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
            <Link
              href="/my-page"
              className="hover:bg-gray1 inline-flex h-10 w-10 items-center justify-center rounded-full"
              aria-label="마이페이지"
            >
              <div className="border-gray2 flex h-9 w-9 items-center justify-center rounded-full border bg-white">
                <Image
                  src="/img/profile.png"
                  alt="프로필"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" />

          <div
            ref={drawerRef}
            className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-xl"
          >
            <div className="border-gray2 flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Image src="/img/logo.svg" alt="Dongsoop" width={24} height={24} />
                <span className="text-normal font-semibold text-black">Dongsoop</span>
              </div>

              <button
                type="button"
                className="hover:bg-gray1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full active:scale-[0.98]"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5 text-black" aria-hidden />
              </button>
            </div>

            <nav className="px-3 py-3">
              <ul className="grid gap-1">
                {NAV.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cx(
                          'text-normal font-regular flex items-center rounded-xl px-3 py-3 transition-colors duration-200',
                          active
                            ? 'bg-primary-5 text-primary'
                            : 'hover:bg-gray1 hover:text-primary text-black',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-gray2 mt-4 border-t pt-4">
                <Link
                  href="/my-page"
                  onClick={() => setOpen(false)}
                  className="hover:bg-gray1 flex items-center gap-3 rounded-xl px-3 py-3"
                >
                  <div className="border-gray2 flex h-10 w-10 items-center justify-center rounded-full border bg-white">
                    <Image
                      src="/img/profile.png"
                      alt="프로필"
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-normal font-semibold text-black">마이페이지</div>
                    <div className="text-small text-gray6">프로필 보기</div>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}