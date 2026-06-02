import type { ReactNode } from 'react';

import PageHeader from '@/components/ui/PageHeader';

type SocialPageLayoutProps = {
  children: ReactNode;
};

export default function SocialPageLayout({ children }: SocialPageLayoutProps) {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
        <PageHeader
          title="소셜 계정 연동"
          description="연결된 계정을 확인하고 로그인 연동 상태를 관리할 수 있어요."
        />

        <div className="mx-auto w-full py-3">
          <div className="w-full rounded-[8px] bg-white p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
