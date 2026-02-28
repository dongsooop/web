'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, MessageCircle } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { label: '홈', href: '/home', icon: <Home className="h-5 w-5" /> },
  { label: '모여봐요', href: '/board', icon: <LayoutGrid className="h-5 w-5" /> },
  { label: '채팅', href: '/chat', icon: <MessageCircle className="h-5 w-5" /> },
  { label: '마이페이지', href: '/mypage', icon: <User className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-gray2 hidden min-h-dvh w-18 shrink-0 border-r bg-white lg:flex">
      <div className="flex w-full flex-col items-center py-4">
        <nav className="flex w-full flex-col items-center gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex w-full flex-col items-center gap-1 py-2"
              >
                <div
                  className={`absolute top-2 left-0 h-10 w-1 rounded-r-full ${
                    active ? 'bg-primary' : 'bg-transparent'
                  }`}
                />

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    active ? 'bg-primary/10 text-primary' : 'text-gray4 hover:bg-gray1'
                  }`}
                >
                  {item.icon}
                </div>

                <div className={`text-small ${active ? 'text-primary' : 'text-gray4'}`}>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pb-2" />
      </div>
    </aside>
  );
}
