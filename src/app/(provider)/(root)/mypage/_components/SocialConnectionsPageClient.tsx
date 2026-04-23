'use client';

import { MyPageProvider } from '@/features/mypage/context/MyPageContext';
import type {
  MyPagePreviewMode,
  MyPageSession,
  SocialPlatform,
} from '@/features/mypage/types/ui-model';
import SocialLoginCard from './SocialLoginCard';

type SocialConnectionsPageClientProps = {
  previewMode: MyPagePreviewMode;
  session: MyPageSession;
};

export default function SocialConnectionsPageClient({
  previewMode,
  session,
}: SocialConnectionsPageClientProps) {
  const handleSelectSocialAccount = (platform: SocialPlatform) => {
    console.log(`${platform} 계정 연동/해제 버튼 클릭`);
  };

  return (
    <MyPageProvider
      value={{
        previewMode,
        session,
        selectMenu: () => undefined,
        selectSocialAccount: handleSelectSocialAccount,
      }}
    >
      <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6 sm:py-7">
        <div className="w-full rounded-[8px] bg-white p-4">
          <div>
            {session.socialAccounts.map((account) => (
              <SocialLoginCard
                key={account.platform}
                platform={account.platform}
                isConnected={account.isConnected}
                onClick={() => handleSelectSocialAccount(account.platform)}
              />
            ))}
          </div>
        </div>
      </div>
    </MyPageProvider>
  );
}
