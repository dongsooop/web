import type { ReactNode } from 'react';

import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';

type SocialConnectLayoutProps = {
  children: ReactNode;
};

export default function SocialConnectLayout({ children }: SocialConnectLayoutProps) {
  return (
    <div className="max-w-content mx-auto flex w-full flex-col gap-4">
      <PageHeader
        title="소셜 계정 연동"
        description="연결된 계정을 확인하고 로그인 연동 상태를 관리할 수 있어요."
        backHref="/mypage"
        backLabel="마이페이지로 돌아가기"
      />

      <div className="mx-auto w-full py-3">
        <Card>{children}</Card>
      </div>
    </div>
  );
}
