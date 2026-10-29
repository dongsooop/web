import Link from 'next/link';
import { CalendarDays, ChevronRight, Table2 } from 'lucide-react';

type AcademicNavProps = {
  active: 'timetable' | 'schedule';
};

const links = [
  { href: '/timetable', label: '내 시간표', icon: Table2, key: 'timetable' },
  { href: '/schedule', label: '학사 · 개인 일정', icon: CalendarDays, key: 'schedule' },
] as const;

export default function AcademicNav({ active }: AcademicNavProps) {
  return (
    <nav className="grid grid-cols-2 gap-3" aria-label="학업 메뉴">
      {links.map(({ href, label, icon: Icon, key }) => (
        <Link
          key={key}
          href={href}
          aria-current={active === key ? 'page' : undefined}
          className={`border-surface-border focus-visible:ring-primary flex min-h-18 min-w-0 items-center gap-3 rounded-xl border px-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5 ${
            active === key
              ? 'border-primary/30 bg-surface-blue'
              : 'hover:border-primary/30 bg-white'
          }`}
        >
          <span
            className="bg-surface-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sky-700"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <strong className="text-caption sm:text-bodySm min-w-0 flex-1 font-semibold text-black">
            {label}
          </strong>
          <ChevronRight
            className="text-surface-muted hidden h-4 w-4 shrink-0 sm:block"
            aria-hidden="true"
          />
        </Link>
      ))}
    </nav>
  );
}
