'use client';

import PageHeader from '@/components/ui/PageHeader';
import type { MyPageSession } from '@/features/mypage/types/ui-model';

import LoggedInCard from './LoggedInCard';
import LoggedOutCard from './LoggedOutCard';

type MyPageContentProps = {
  session: MyPageSession;
};

export default function MyPageContent({ session }: MyPageContentProps) {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-4">
        <PageHeader
          title="마이페이지"
          description="내 정보와 서비스 이용 내역을 한곳에서 관리할 수 있어요."
        />

        <div className="mx-auto w-full py-3">
          {session.isLoggedIn && session.user ? <LoggedInCard user={session.user} /> : <LoggedOutCard />}
        </div>
      </div>
    </div>
  );
}
