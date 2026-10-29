import { Suspense } from 'react';

import GoogleProvider from '@/providers/GoogleProvider';
import SignInForm from '@/features/auth/components/sign-in/SignInForm';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';
  const googleClientId = process.env.GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

  return (
    <GoogleProvider clientId={googleClientId}>
      <Suspense fallback={null}>
        <SignInForm kakaoJsKey={kakaoJsKey} />
      </Suspense>
    </GoogleProvider>
  );
}
