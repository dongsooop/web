'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isNavActive, NAV } from './Sidebar';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-surface-border fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
      aria-label="주요 메뉴"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {NAV.map((item) => {
          const active = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`focus-visible:ring-primary flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                active ? 'text-primary' : 'text-gray4 hover:bg-surface-soft hover:text-gray6'
              }`}
            >
              <span className="[&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
