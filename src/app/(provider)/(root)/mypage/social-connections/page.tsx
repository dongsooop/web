import WebPlaceholder from '@/components/placeholder/WebPlaceholder';
import { getMockMyPageSession } from '@/features/mypage/mock-data';

import SocialConnectionsPageClient from '../_components/SocialConnectionsPageClient';

type SocialConnectionsPageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function SocialConnectionsPage({
  searchParams,
}: SocialConnectionsPageProps) {
  const params = await searchParams;
  const { previewMode, session } = getMockMyPageSession(params?.view);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="소셜 계정 연동"
        description="연결된 계정을 확인하고 로그인 연동 상태를 관리할 수 있어요."
      >
        <SocialConnectionsPageClient previewMode={previewMode} session={session} />
      </WebPlaceholder>
    </div>
  );
}
