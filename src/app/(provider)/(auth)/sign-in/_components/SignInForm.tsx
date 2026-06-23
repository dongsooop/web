'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';

import Button from '@/components/ui/Button';
import SocialLoginButtons from './SocialButtons';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import AuthInput from '../../_components/AuthInput';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGoogleLink } from '@/features/auth/hooks/useGoogleLink';
import { useKakaoLink } from '@/features/auth/hooks/useKakaoLink';
import { useSocialError } from '@/features/auth/hooks/useSocialError';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';

const kakaoSdkUrl = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js';

type SignInFormProps = {
  kakaoJsKey: string;
};

export default function SignInForm({ kakaoJsKey }: SignInFormProps) {
  const router = useRouter();
  const { signIn, signInGoogleSocial } = useAuth();
  const showDialog = useDialogStore((state) => state.showDialog);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loadingPlatform, setLoadingPlatform] = useState<'google' | 'kakao' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  useEffect(() => {
    const sdk = window.Kakao;

    if (!sdk || !kakaoJsKey) {
      setIsKakaoReady(false);
      return;
    }

    try {
      if (!sdk.isInitialized()) {
        sdk.init(kakaoJsKey);
      }

      setIsKakaoReady(true);
    } catch {
      setIsKakaoReady(false);
    }
  }, [kakaoJsKey]);

  const openSocialErrorDialog = (message: string) => {
    setLoadingPlatform(null);

    showDialog({
      title: '소셜 로그인 오류',
      content: message,
      confirm: '확인',
      isSingleAction: true,
      color: 'danger',
      onConfirm: () => {},
    });
  };

  useSocialError((message) => {
    openSocialErrorDialog(message);
  }, '/sign-in');

  const kakao = useKakaoLink({
    jsKey: kakaoJsKey,
    stateKey: 'kakao_signin_state',
    stateType: 'signin',
    onError: openSocialErrorDialog,
    onFinish: () => {
      setLoadingPlatform(null);
    },
  });

  const google = useGoogleLink({
    onToken: async (token) => {
      await signInGoogleSocial(token);
      router.push('/');
    },
    onError: openSocialErrorDialog,
    onFinish: () => {
      setLoadingPlatform(null);
    },
    context: 'login',
    redirectPath: '/sign-in/google/callback',
    stateKey: 'google_signin_state',
    stateType: 'signin',
  });

  const handleLogin = async () => {
    if (isSigningIn) return;

    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setErrorMessage('학교 Gmail을 입력해 주세요.');
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setIsSigningIn(true);

      await signIn({
        email: `${trimmedEmail}@dongyang.ac.kr`,
        password: trimmedPassword,
      });

      router.push('/');
    } catch (error) {
      setErrorMessage(getErrorMessage('auth', error));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handlePasswordReset = () => {
    router.push('/password-reset?from=sign-in');
  };

  const socialLogin = (platform: 'kakao' | 'google') => {
    if (isSigningIn || loadingPlatform) {
      return;
    }

    setErrorMessage(null);
    setLoadingPlatform(platform);

    if (platform === 'google') {
      google.start();
      return;
    }

    if (!isKakaoReady) {
      openSocialErrorDialog('카카오 로그인 준비 중이에요. 잠시 후 다시 시도해주세요.');
      return;
    }

    kakao.start();
  };

  return (
    <section className="flex w-full max-w-[480px] flex-col items-center gap-4 pt-4">
      <Script
        src={kakaoSdkUrl}
        strategy="afterInteractive"
        onLoad={() => {
          kakao.init();
          setIsKakaoReady(true);
        }}
        onError={() => {
          setIsKakaoReady(false);
        }}
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

      <Button fullWidth color="primary" onClick={handleLogin} isLoading={isSigningIn}>
        로그인
      </Button>

      <Button fullWidth color="outline" onClick={handleSignUp}>
        회원가입
      </Button>

      <button
        type="button"
        onClick={handlePasswordReset}
        className="text-normal text-gray4 min-h-11 cursor-pointer font-bold"
      >
        비밀번호 변경
      </button>
      <SocialLoginButtons onLogin={socialLogin} />
    </section>
  );
}
