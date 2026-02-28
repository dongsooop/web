import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';

export default function PopularRecruits() {
  const items = [
    {
      href: '/board/recruits/11',
      title: 'DB 프로그래밍',
      description: '[DB 프로그래밍 튜터링 모집합니다] 교내 튜터링 인원 모집합니다.',
      tags: [
        { label: '컴퓨터소프트웨어공학과', tone: 'blue' as const },
        { label: 'DB', tone: 'red' as const },
        { label: '김희석교수님', tone: 'yellow' as const },
      ],
    },
    {
      href: '/board/recruits/12',
      title: '웹 프로젝트 실습',
      description: '팀원 잘 만나는 게 A+ 받는 방법이다',
      tags: [
        { label: '컴퓨터소프트웨어공학과', tone: 'blue' as const },
        { label: 'JAVA', tone: 'red' as const },
        { label: '장윤희교수님', tone: 'yellow' as const },
      ],
    },
    {
      href: '/board/recruits/13',
      title: '운영체제 실습',
      description: '리눅스를 배워보아요',
      tags: [
        { label: '컴퓨터소프트웨어공학과', tone: 'blue' as const },
        { label: 'Linux', tone: 'red' as const },
        { label: '전홍준교수님', tone: 'yellow' as const },
      ],
    },
  ];

  return (
    <Card
      title="인기 모집"
      right={
        <Link
          href="/board/recruits"
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
