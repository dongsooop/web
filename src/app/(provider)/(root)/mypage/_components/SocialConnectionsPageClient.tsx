'use client';

import { MyPageProvider } from '@/features/mypage/context/MyPageContext';
import type { MyPagePreviewMode, MyPageSession } from '@/features/mypage/types/ui-model';
import SocialLoginCard from './SocialLoginCard';

type SocialConnectionsPageClientProps = {
  previewMode: MyPagePreviewMode;
  session: MyPageSession;
};

export default function SocialConnectionsPageClient({
  previewMode,
  session,
}: SocialConnectionsPageClientProps) {
  const handleSelectSocialAccount = (platform: string) => {
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
      <div className="bg-gray7 min-h-[calc(100dvh-6rem)]">
        <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6 sm:py-7">
          <div className="mb-5">
            <h1 className="text-title font-bold text-black">소셜 계정 연동</h1>
            <p className="text-small text-gray5 mt-1">
              원하는 소셜 계정을 연동하거나 해제할 수 있어요.
            </p>
          </div>

          <div className="w-full rounded-[8px] bg-white p-4">
            <div>
              {session.socialAccounts.map((account) => (
                <SocialLoginCard
                  key={account.platform}
                  platform={account.platform}
                  isConnected={account.isConnected}
                  buttonProps={{
                    onClick: () => handleSelectSocialAccount(account.platform),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MyPageProvider>
  );
}
