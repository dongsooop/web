import { Suspense } from 'react';

import GoogleProvider from '@/providers/GoogleProvider';
import SocialConnectLayout from './_components/SocialConnectLayout';
import SocialConnectList from './_components/SocialConnectList';

export const dynamic = 'force-dynamic';

export default function SocialConnectionsPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';
  const googleClientId = process.env.GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

  return (
    <SocialConnectLayout>
      <GoogleProvider clientId={googleClientId}>
        <Suspense fallback={null}>
          <SocialConnectList kakaoJsKey={kakaoJsKey} />
        </Suspense>
      </GoogleProvider>
    </SocialConnectLayout>
  );
}
