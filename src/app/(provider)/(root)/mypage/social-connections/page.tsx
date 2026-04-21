import AppShell from '@/components/layout/AppShell';
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
    <AppShell>
      <SocialConnectionsPageClient previewMode={previewMode} session={session} />
    </AppShell>
  );
}
