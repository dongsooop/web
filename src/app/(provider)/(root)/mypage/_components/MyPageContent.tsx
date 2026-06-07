'use client';

import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';

import LoggedInCard from './LoggedInCard';
import LoggedOutCard from './LoggedOutCard';
import MyPageSkeleton from './MyPageSkeleton';

export default function MyPageContent() {
  const { isLoggedIn, isReady, user } = useAuth();

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
        <PageHeader
          title="마이페이지"
          description="내 정보와 서비스 이용 내역을 한곳에서 관리할 수 있어요."
        />

        <div className="mx-auto w-full py-3">
          {!isReady ? (
            <MyPageSkeleton />
          ) : isLoggedIn && user ? (
            <LoggedInCard user={user} />
          ) : (
            <LoggedOutCard />
          )}
        </div>
      </div>
    </div>
  );
}
