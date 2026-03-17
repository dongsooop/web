'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';
import { useHomeQuery } from '@/features/home/hooks/useHomeQuery';

export default function NewNotices() {
  const { data, isLoading, isError, displayErrorMessage } = useHomeQuery();

  if (isLoading) return <div>공지사항 로딩 중...</div>;
  if (isError) return <div>{displayErrorMessage}</div>;

  const items = data?.notices ?? [];

  return (
    <Card
      title="새로운 공지"
      right={
        <Link
          href="/board/notices"
          target="_blank"
          rel="noopener noreferrer"
          className="text-normal text-gray5 inline-flex items-center gap-2 font-semibold hover:text-black"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="border-gray2 rounded-2xl bg-white px-2">
        {items.map((it, idx) => (
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
