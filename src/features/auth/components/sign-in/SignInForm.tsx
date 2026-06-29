'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';

import Button from '@/components/ui/Button';
import SocialLoginButtons from './SocialButtons';
import SchoolEmailInput from '@/features/auth/components/common/SchoolEmailInput';
import AuthInput from '@/features/auth/components/common/AuthInput';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAuthSocial } from '@/features/auth/hooks/useAuthSocial';
import { getErrorMessage } from '@/lib/errors/messages';

const kakaoSdkUrl = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js';

type SignInFormProps = {
  kakaoJsKey: string;
};

export default function SignInForm({ kakaoJsKey }: SignInFormProps) {
  const router = useRouter();

  const error = useAuthStore((state) => state.error);
  const errorContext = useAuthStore((state) => state.errorContext);
  const setError = useAuthStore((state) => state.actions.setError);

  const { signIn, isSubmitting } = useAuth();
  const { socialLogin, setIsKakaoReady, kakao } = useAuthSocial({ kakaoJsKey });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorMessage = error
    ? getErrorMessage('auth', error, errorContext ?? undefined)
    : null;

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError('INPUT_EMAIL_REQUIRED', 'signIn');
      return;
    }
    if (!trimmedPassword) {
      setError('INPUT_PASSWORD_REQUIRED', 'signIn');
      return;
    }

    try {
      await signIn({
        email: `${trimmedEmail}@dongyang.ac.kr`,
        password: trimmedPassword,
      });
      router.push('/');
    } catch {}
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void handleLogin();
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white px-4">
      <section className="max-w-form flex w-full flex-col items-center justify-center gap-4 pt-4">
        <Script
          src={kakaoSdkUrl}
          strategy="afterInteractive"
          onLoad={() => {
            kakao.init();
            setIsKakaoReady(true);
          }}
          onError={() => setIsKakaoReady(false)}
        />

        <div className="h-4" />
        <div className="flex items-center">
          <Image
            src="/img/logo.svg"
            alt="동숲 로고"
            width={128}
            height={128}
            className="h-32 w-32"
            priority
          />
        </div>

        <div className="h-2" />

        <form className="flex w-full flex-col items-center gap-4" onSubmit={handleSubmit}>
          <div className="w-full">
            <SchoolEmailInput
              value={email}
              onChange={setEmail}
              placeholder="학교 Gmail을 입력해 주세요"
            />
          </div>

          <div className="w-full">
            <AuthInput
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="비밀번호를 입력해 주세요"
            />
          </div>

          {errorMessage && (
            <p className="text-caption font-regular text-warning w-full whitespace-pre-line">
              {errorMessage}
            </p>
          )}

          <Button fullWidth type="submit" color="primary" isLoading={isSubmitting}>
            로그인
          </Button>

          <Button fullWidth type="button" color="outline" onClick={() => router.push('/sign-up')}>
            회원가입
          </Button>

          <button
            type="button"
            onClick={() => router.push('/password-reset?from=sign-in')}
            className="text-normal text-gray4 min-h-11 cursor-pointer font-bold"
          >
            비밀번호 변경
          </button>
        </form>
        <SocialLoginButtons onLogin={socialLogin} />
      </section>
    </div>
  );
}
