'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';
import type { HomeUiModel } from '@/features/home/types/ui-model';

type PopularRecruitsProps = {
  popularRecruitments: HomeUiModel['popularRecruitments'];
};

export default function PopularRecruits({ popularRecruitments }: PopularRecruitsProps) {
  return (
    <Card
      title="인기 모집"
      right={
        <Link
          href="/board/recruits"
          className="text-normal text-gray5 inline-flex min-h-11 items-center gap-2 px-2 font-semibold hover:text-black"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="border-gray2 rounded-2xl bg-white px-2">
        {popularRecruitments.length > 0 ? (
          popularRecruitments.map((it, idx) => (
            <div key={it.id} className={idx === 0 ? '' : 'border-gray2 border-t'}>
              // 게시판 기능 추가되면 경로 변경
              <ListItem href={`${it.id}`} title={it.title} tags={it.tags} />
            </div>
          ))
        ) : (
          <div className="text-gray4 flex h-[200px] flex-col items-center justify-center gap-2">
            <p className="text-normal font-medium">지금은 인기 모집 게시글이 없어요!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
