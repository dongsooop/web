'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

import LoggedInCard from './LoggedInCard';
import LoggedOutCard from './LoggedOutCard';
import MyPageSkeleton from './MyPageSkeleton';

export default function MyPageContent() {
  const { isLoggedIn, isReady, user } = useAuth();

  return (
    <div className="home-dashboard">
      <header className="home-intro">
        <div>
          <p className="home-date">MY DONGSOOP</p>
          <h1>
            나의 동숲, 한곳에. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">내 정보와 학업·계정 설정을 편하게 관리해요.</p>
        </div>
        <span className="home-semester">마이페이지</span>
      </header>

      {!isReady ? (
        <MyPageSkeleton />
      ) : isLoggedIn && user ? (
        <LoggedInCard user={user} />
      ) : (
        <LoggedOutCard />
      )}
    </div>
  );
}
