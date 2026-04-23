'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Link2, MessageCircleMore, Settings, Table2 } from 'lucide-react';
import type { User } from '@/features/auth/types/ui-model';

import { getDepartmentDisplayName } from '@/constants/department';

import ManagementLinkCard from './ManagementLinkCard';

type LoggedInCardProps = {
  user: User;
};

export default function LoggedInCard({ user }: LoggedInCardProps) {

  const departmentLabel = getDepartmentDisplayName(user.departmentType);

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg bg-white p-4 py-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
            <Image
              src="/img/profile.png"
              alt={user.nickname}
              width={56}
              height={56}
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-large font-bold text-black">{user.nickname}</div>
            <div className="bg-primary-5 text-small text-primary mt-2 inline-flex max-w-full items-center rounded-full px-3 py-1 font-bold">
              <span className="truncate">{departmentLabel}</span>
            </div>
          </div>

          <Link
            href="/setting"
            aria-label="설정"
            className="flex h-11 min-h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-black"
          >
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="w-full rounded-lg bg-white p-4">
        <div className="text-small mb-3 px-1 font-bold text-black">학사 관리</div>

        <ManagementLinkCard
          href="/timetable"
          icon={Table2}
          title="시간표 관리"
          description="수강 중인 과목과 시간표를 확인하고 관리할 수 있어요."
        />

        <div className="bg-gray2 m-3 h-px" />

        <ManagementLinkCard
          href="/schedule"
          icon={CalendarDays}
          title="일정 관리"
          description="나의 일정을 추가하고 계획을 관리할 수 있어요."
        />
      </div>

      <div className="w-full rounded-lg bg-white p-4">
        <div className="text-small mb-3 px-1 font-bold text-black">연결 및 지원</div>

        <ManagementLinkCard
          href="/mypage/social-connections"
          icon={Link2}
          title="소셜 계정 연동"
          description="원하는 소셜 계정을 연동하거나 해제할 수 있어요."
        />

        <div className="bg-gray2 m-3 h-px" />

        <ManagementLinkCard
          href="/mypage/feedback"
          icon={MessageCircleMore}
          title="피드백 하러가기"
          description="서비스 이용 중 불편한 점이나 개선 사항을 알려주세요."
        />
      </div>
    </div>
  );
}
