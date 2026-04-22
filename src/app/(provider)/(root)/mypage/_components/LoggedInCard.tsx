'use client';

import Image from 'next/image';
import { CalendarDays, Link2, MessageCircleMore, Table2 } from 'lucide-react';
import { useMyPageContext } from '@/features/mypage/context/MyPageContext';

import { getDepartmentDisplayName } from '@/constants/department';

import ManagementLinkCard from './ManagementLinkCard';
import MyActivityItem from './MyActivityItem';

export default function LoggedInCard() {
  const { session, selectMenu } = useMyPageContext();
  const user = session.user;

  if (!user) return null;

  const isAdmin = user.role.includes('ADMIN');
  const departmentLabel = getDepartmentDisplayName(user.departmentType);

  return (
    <div className="space-y-4">
      <div className="w-full rounded-[8px] bg-white px-4 py-5">
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

          <div className="min-w-0">
            <div className="text-large font-bold text-black">{user.nickname}</div>
            <div className="bg-primary-5 text-small text-primary mt-2 inline-flex max-w-full items-center rounded-full px-3 py-1 font-bold">
              <span className="truncate">{departmentLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-[8px] bg-white p-4">
        <div className="text-small mb-3 px-1 font-bold text-black">학사 관리</div>

        <ManagementLinkCard
          href="/timetable"
          icon={Table2}
          title="시간표 관리"
          description="수강 중인 과목과 시간표를 확인하고 관리할 수 있어요."
        />

        <div className="bg-gray2 m-3 h-px" />

        <ManagementLinkCard
          href="/calendar"
          icon={CalendarDays}
          title="일정 관리"
          description="나의 일정을 추가하고 계획을 관리할 수 있어요."
        />
      </div>

      <div className="w-full rounded-[8px] bg-white p-4">
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

      {isAdmin ? (
        <div className="w-full rounded-[8px] bg-white px-4 py-2">
          <div className="space-y-1">
            <MyActivityItem label="신고 관리" onClick={() => selectMenu('admin-report')} />
            <MyActivityItem label="과팅 오픈" onClick={() => selectMenu('admin-blind-date')} />
            <MyActivityItem label="사용자 피드백 결과" onClick={() => selectMenu('admin-feedback')} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
