import { Suspense } from 'react';

import GoogleProvider from '@/providers/GoogleProvider';
import SocialPageLayout from './_components/SocialPageLayout';
import SocialConnect from './_components/SocialConnect';

export const dynamic = 'force-dynamic';

export default function SocialConnectionsPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';
  const googleClientId = process.env.GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

  return (
    <SocialPageLayout>
      <GoogleProvider clientId={googleClientId}>
        <Suspense fallback={null}>
          <SocialConnect kakaoJsKey={kakaoJsKey} />
        </Suspense>
      </GoogleProvider>
    </SocialPageLayout>
  );
}
