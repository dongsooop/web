'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { HomeUiModel } from '@/features/home/types/ui-model';

type NewNoticesProps = {
  notices: HomeUiModel['notices'];
};

export default function NewNotices({ notices }: NewNoticesProps) {
  return (
    <section aria-labelledby="notice-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="notice-title" className="text-2xl font-bold tracking-[-0.025em] text-black">
          새로운 공지
        </h2>
        <Link
          href="/notices"
          className="text-surface-muted hover:bg-surface-soft focus-visible:ring-primary inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none"
        >
          더보기
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-3">
        {notices.map((it, idx) => (
          <li key={it.link} className={idx === 0 ? '' : 'border-surface-border border-t'}>
            <a
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group focus-visible:ring-primary grid min-h-24 grid-cols-[8px_minmax(0,1fr)] gap-4 rounded-xl px-2 py-5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="bg-primary mt-2 h-2 w-2 rounded-full" aria-hidden="true" />
              <span className="min-w-0">
                <span className="group-hover:text-primary block text-base leading-6 font-bold text-black sm:text-lg">
                  {it.title}
                </span>
                <span className="text-surface-muted mt-2 block text-sm font-medium">
                  {it.typeLabel}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
