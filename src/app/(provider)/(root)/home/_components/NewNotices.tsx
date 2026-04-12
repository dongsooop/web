'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';
import type { HomeUiModel } from '@/features/home/types/ui-model';

type NewNoticesProps = {
  notices: HomeUiModel['notices'];
};

export default function NewNotices({ notices }: NewNoticesProps) {
  return (
    <Card
      title="새로운 공지"
      right={
        <Link
          href="/board/notices"
          target="_blank"
          rel="noopener noreferrer"
          className="text-normal text-gray5 inline-flex min-h-11 items-center gap-2 px-2 font-semibold hover:text-black"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="border-gray2 rounded-2xl bg-white px-2">
        {notices.map((it, idx) => (
          <div key={it.link} className={idx === 0 ? '' : 'border-gray2 border-t'}>
            <ListItem
              href={it.link}
              title={it.title}
              tags={it.tags}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
