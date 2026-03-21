'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import SocialLoginButtons from './SocialButtons';
import Image from 'next/image';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import AuthInput from '../../_components/AuthInput';

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('학교 Gmail을 입력해 주세요.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setIsLoading(true);


      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push('/mypage');
    } catch {
      setErrorMessage('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (platform: 'kakao' | 'google' | 'apple') => {
    try {
      setErrorMessage(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (platform === 'kakao') {
        setDialogMessage('카카오 로그인 중 오류가 발생했습니다.');
        return;
      }

      router.push('/mypage');
    } catch {
      setDialogMessage('소셜 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handlePasswordReset = () => {
    router.push('/password-reset');
  };

  return (
    <>
      <section className="flex w-full max-w-[480px] flex-col items-center gap-4 pt-4">
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

        <Button fullWidth variant="primary" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>

        <Button fullWidth variant="outline" onClick={handleSignUp}>
          회원가입
        </Button>

        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-normal text-gray4 min-h-[44px] font-bold"
        >
          비밀번호 변경
        </button>

        <SocialLoginButtons onLogin={handleSocialLogin} />
      </section>
    </>
  );
}
