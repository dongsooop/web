import WebPlaceholder from '@/components/placeholder/WebPlaceholder';
import { getMockMyPageSession } from '@/features/mypage/mock-data';

import MyPageContent from './_components/MyPageContent';

type MyPagePageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function MyPagePage({ searchParams }: MyPagePageProps) {
  const params = await searchParams;
  const { previewMode, session } = getMockMyPageSession(params?.view);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="마이페이지"
        description="내 정보와 서비스 이용 내역을 한곳에서 관리할 수 있어요."
      >
        <MyPageContent session={session} previewMode={previewMode} />
      </WebPlaceholder>
    </div>
  );
}
