'use client';

import { Settings } from 'lucide-react';
import { MyPageProvider } from '@/features/mypage/context/MyPageContext';
import type {
  MyPageMenuAction,
  MyPagePreviewMode,
  MyPageSession,
  SocialPlatform,
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

  const handleSelectSocialAccount = (platform: SocialPlatform) => {
    console.log(`${platform} 계정 연동/해제 버튼 클릭`);
  };

  return (
    <MyPageProvider
      value={{
        previewMode,
        session,
        selectMenu: handleSelectMenu,
        selectSocialAccount: handleSelectSocialAccount,
      }}
    >
      <div className="bg-gray7 min-h-[calc(100dvh-6rem)]">
        <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6 sm:py-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-title font-bold text-black">마이페이지</h1>
              <p className="text-small text-gray5 mt-1">내 정보와 활동을 한 곳에서 관리해보세요.</p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectMenu('setting')}
              aria-label="설정"
              className="flex h-11 min-h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-black"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>

          {session.isLoggedIn && session.user ? <LoggedInCard /> : <LoggedOutCard />}
        </div>
      </div>
    </MyPageProvider>
  );
}
