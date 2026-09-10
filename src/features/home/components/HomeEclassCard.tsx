'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import LoginRequiredGuard from '@/components/ui/LoginRequiredGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { HomeUiModel } from '@/features/home/types/ui-model';

type HomeEclassCardProps = {
  eclass: HomeUiModel['eclass'];
};

function EclassCardBody({ eclass }: HomeEclassCardProps) {
  if (!eclass.linked) {
    return (
      <div className="bg-primary/5 flex flex-1 flex-col justify-center gap-3 rounded-xl p-4">
        <p className="text-caption text-gray6">
          이클래스를 연동하면 과제 마감을 홈에서 바로 보고 알림으로 받아요.
        </p>
        <Link
          href="/eclass"
          className="bg-primary text-caption inline-flex h-9 w-fit items-center rounded-lg px-4 font-semibold text-white"
        >
          연동하기
        </Link>
      </div>
    );
  }

  if (eclass.status === 'EXPIRED') {
    return (
      <div className="bg-warning/10 flex flex-1 flex-col justify-center gap-3 rounded-xl p-4">
        <p className="text-caption text-warning-80">
          이클래스 연결이 끊겼어요. 비밀번호가 바뀌었을 수 있어요.
        </p>
        <Link
          href="/eclass"
          className="bg-warning text-caption inline-flex h-9 w-fit items-center rounded-lg px-4 font-semibold text-white"
        >
          다시 연동
        </Link>
      </div>
    );
  }

  if (!eclass.nearest) {
    return (
      <div className="bg-primary/5 flex flex-1 items-center justify-center rounded-xl p-4">
        <p className="text-caption text-gray6">마감이 남은 과제가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="bg-primary/5 flex items-center gap-3 rounded-xl p-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-bold ${
            eclass.nearest.isUrgent ? 'bg-warning text-white' : 'text-primary bg-white'
          }`}
        >
          {eclass.nearest.dDayLabel}
        </div>

        <div className="min-w-0">
          <div className="text-caption text-primary font-semibold">{eclass.nearest.courseName}</div>
          <div className="text-body line-clamp-2 font-semibold text-black">
            {eclass.nearest.title}
          </div>
          <div className="text-caption text-gray5">마감 {eclass.nearest.dueLabel}</div>
        </div>
      </div>

      <div className="text-caption text-gray6">
        남은 과제 <span className="font-semibold text-black">{eclass.upcomingCount}개</span>
      </div>
    </div>
  );
}

export default function HomeEclassCard({ eclass }: HomeEclassCardProps) {
  const { isLoggedIn } = useAuth();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-body font-semibold text-black">이클래스 과제</h2>
          <p className="text-caption text-gray5 mt-1">마감이 다가오는 과제를 확인하세요</p>
        </div>

        {isLoggedIn ? (
          <Link
            href="/eclass"
            className="text-caption text-gray5 hover:bg-gray1 inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-1"
            aria-label="더보기"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="text-caption text-gray4 inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full px-3 py-1">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <LoginRequiredGuard isLoggedIn={isLoggedIn} className="mt-4 flex flex-1 flex-col">
        <div className="flex h-full flex-col">
          <EclassCardBody eclass={eclass} />
        </div>
      </LoginRequiredGuard>
    </Card>
  );
}
