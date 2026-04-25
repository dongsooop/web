import SocialConnectionsPageClient from '../_components/SocialConnectionsPageClient';
import type { SocialPlatform } from '../_components/SocialLoginCard';

const socialAccounts: {
  platform: SocialPlatform;
  isConnected: boolean;
}[] = [
  {
    platform: 'KAKAO',
    isConnected: false,
  },
  {
    platform: 'GOOGLE',
    isConnected: false,
  },
  {
    platform: 'APPLE',
    isConnected: false,
  },
];

export default function SocialConnectionsPage() {

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <SocialConnectionsPageClient accounts={socialAccounts} />
    </div>
  );
}
