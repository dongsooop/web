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
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-4 lg:min-h-[calc(100dvh-3rem)]">
      <MyPageContent session={session} previewMode={previewMode} />
    </div>
  );
}
