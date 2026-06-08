import { Suspense } from 'react';

import GoogleProvider from '@/providers/GoogleProvider';
import SignInForm from './_components/SignInForm';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';
  const googleClientId = process.env.GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
      <GoogleProvider clientId={googleClientId}>
        <Suspense fallback={null}>
          <SignInForm kakaoJsKey={kakaoJsKey} />
        </Suspense>
      </GoogleProvider>
    </div>
  );
}
