import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';

export default function NewNotices() {
  const items = [
    {
      href: '/board/notices/1',
      title: '[선관위] 2025학년도 학과대표 보궐선거 선거 일정 공고',
      tags: [
        { label: '동양공지', tone: 'blue' as const },
        { label: '학교생활', tone: 'red' as const },
      ],
    },
    {
      href: '/board/notices/2',
      title: '2025학년도 신입생 캠퍼스커넥트 프로그램 토크콘서트 안내',
      tags: [
        { label: '동양공지', tone: 'blue' as const },
        { label: '학교생활', tone: 'red' as const },
      ],
    },
    {
      href: '/board/notices/3',
      title: '[학부] 2025학년도 1학기 학습공동체(전공 튜터링) 프로그램 시행 안내',
      tags: [
        { label: '학과공지', tone: 'blue' as const },
        { label: '학부', tone: 'red' as const },
      ],
    },
  ];

  return (
    <Card
      title="새로운 공지"
      right={
        <Link
          href="/board/notices"
          className="text-normal text-gray5 inline-flex items-center gap-2 font-semibold hover:text-black"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="border-gray2 rounded-2xl bg-white px-2">
        {items.map((it, idx) => (
          <div key={it.href} className={idx === 0 ? '' : 'border-gray2 border-t'}>
            <ListItem href={it.href} title={it.title} tags={it.tags} />
          </div>
        ))}
      </div>
    </Card>
  );
}
