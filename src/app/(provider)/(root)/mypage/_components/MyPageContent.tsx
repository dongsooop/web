'use client';

import PageHeader from '@/components/ui/PageHeader';
import { MyPageProvider } from '@/features/mypage/context/MyPageContext';
import type {
  MyPageMenuAction,
  MyPagePreviewMode,
  MyPageSession,
} from '@/features/mypage/types/ui-model';

import LoggedInCard from './LoggedInCard';
import LoggedOutCard from './LoggedOutCard';

type MyPageContentProps = {
  session: MyPageSession;
  previewMode: MyPagePreviewMode;
};

export default function MyPageContent({ session, previewMode }: MyPageContentProps) {
  const handleSelectMenu = (action: MyPageMenuAction) => {
    const actionLabelMap: Record<MyPageMenuAction, string> = {
      setting: '설정 페이지로 이동',
      login: '로그인 페이지로 이동',
      calendar: '일정 관리 페이지로 이동',
      timetable: '시간표 관리 페이지로 이동',
      'admin-report': '신고 관리 페이지로 이동',
      'admin-blind-date': '과팅 오픈 페이지로 이동',
      'admin-feedback': '사용자 피드백 결과 페이지로 이동',
      'user-feedback': '피드백 페이지로 이동',
    };

    console.log(actionLabelMap[action]);
  };

  return (
    <MyPageProvider
      value={{
        previewMode,
        session,
        selectMenu: handleSelectMenu,
      }}
    >
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-4">
          <PageHeader
            title="마이페이지"
            description="내 정보와 서비스 이용 내역을 한곳에서 관리할 수 있어요."
          />

          <div className="mx-auto w-full py-3">
            {session.isLoggedIn && session.user ? <LoggedInCard /> : <LoggedOutCard />}
          </div>
        </div>
      </div>
    </MyPageProvider>
  );
}
