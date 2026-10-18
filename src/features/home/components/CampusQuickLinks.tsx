import Link from 'next/link';
import { BookOpen, CalendarDays, Map, UtensilsCrossed } from 'lucide-react';

const LINKS = [
  {
    label: '맛집',
    href: '/restaurants',
    icon: UtensilsCrossed,
    tone: 'bg-surface-cream',
    external: false,
  },
  {
    label: '도서관',
    href: 'https://lib.dongyang.ac.kr/',
    icon: BookOpen,
    tone: 'bg-surface-soft',
    external: true,
  },
  { label: '캠퍼스', href: '/campus', icon: Map, tone: 'bg-surface-blue', external: false },
  {
    label: '학사일정',
    href: '/schedule',
    icon: CalendarDays,
    tone: 'bg-surface-mint',
    external: false,
  },
] as const;

export default function CampusQuickLinks() {
  return (
    <section aria-labelledby="quick-link-title">
      <h2 id="quick-link-title" className="text-2xl font-bold tracking-[-0.025em] text-black">
        바로가기
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LINKS.map(({ label, href, icon: Icon, tone, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group focus-visible:ring-primary flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span
              className={`${tone} group-hover:ring-primary/15 text-gray6 flex h-16 w-16 items-center justify-center rounded-2xl transition group-hover:ring-4`}
            >
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="text-gray6 text-sm font-bold group-hover:text-black">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
