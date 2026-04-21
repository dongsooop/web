import AppShell from '@/components/layout/AppShell';
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
    <AppShell>
      <MyPageContent session={session} previewMode={previewMode} />
    </AppShell>
  );
}
