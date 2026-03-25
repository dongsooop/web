'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import AuthInput from '../../_components/AuthInput';
import { validatePassword } from '@/features/auth/validators/authValidators';

type Step = 'email' | 'password';

export default function PasswordResetForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [emailCodeError, setEmailCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  const isEmailValid = useMemo(() => {
    return email.trim().length > 0 && emailCode.trim().length > 0 && isCodeVerified;
  }, [email, emailCode, isCodeVerified]);

  const isPasswordValid = useMemo(() => {
    return (
      password.trim().length > 0 &&
      passwordCheck.trim().length > 0 &&
      validatePassword(password) &&
      password === passwordCheck
    );
  }, [password, passwordCheck]);

  const emailButtonVariant = !email.trim() || isEmailChecked ? 'gray' : 'primary';
  const emailButtonDisabled = !email.trim() || isEmailChecked;

  const sendCodeButtonVariant = !isEmailChecked || isCodeSent ? 'gray' : 'primary';
  const sendCodeButtonDisabled = !isEmailChecked || isCodeSent;

  const verifyCodeButtonVariant =
    !isEmailChecked || !emailCode.trim() || isCodeVerified ? 'gray' : 'primary';
  const verifyCodeButtonDisabled = !isEmailChecked || !emailCode.trim() || isCodeVerified;

  const handleChangeEmail = (value: string) => {
    setEmail(value);

    setEmailError(false);
    setEmailCodeError(false);
    setPasswordError(false);
    setPasswordCheckError(false);

    setIsEmailChecked(false);
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setEmailCode('');
  };

  const handleChangeEmailCode = (value: string) => {
    setEmailCode(value);
    setEmailCodeError(false);
    setIsCodeVerified(false);
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setPasswordError(false);
    setPasswordCheckError(false);
  };

  const handleChangePasswordCheck = (value: string) => {
    setPasswordCheck(value);
    setPasswordCheckError(false);
  };

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    setEmailError(false);

    try {
      setIsCheckingEmail(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEmailChecked(true);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSendCode = async () => {
    if (!isEmailChecked) {
      return;
    }

    setEmailError(false);

    try {
      setIsSendingCode(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsCodeSent(true);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!emailCode.trim()) {
      setEmailCodeError(true);
      return;
    }

    setEmailCodeError(false);

    try {
      setIsVerifyingCode(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsCodeVerified(true);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleNext = () => {
    let hasError = false;

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }

    if (!emailCode.trim()) {
      setEmailCodeError(true);
      hasError = true;
    }

    if (!isEmailChecked || !isCodeSent || !isCodeVerified) {
      if (!email.trim()) {
        setEmailError(true);
      }
      if (!emailCode.trim()) {
        setEmailCodeError(true);
      }
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setStep('password');
  };

  const handlePasswordReset = async () => {
    let hasError = false;

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (!passwordCheck.trim()) {
      setPasswordCheckError(true);
      hasError = true;
    }

    if (password.trim() && !validatePassword(password)) {
      setPasswordError(true);
      hasError = true;
    }

    if (passwordCheck.trim() && password !== passwordCheck) {
      setPasswordCheckError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 700));
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex w-full max-w-[480px] flex-col gap-8 px-5 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-black">비밀번호 재설정</h1>
          <p className="text-sm text-gray-500">
            {step === 'email'
              ? '학교 이메일과 인증 코드를 입력해 주세요.'
              : '새로운 비밀번호를 입력해 주세요.'}
          </p>
        </header>

        {step === 'email' ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <SchoolEmailInput
                  value={email}
                  onChange={handleChangeEmail}
                  placeholder="학교 Gmail 입력"
                  hasError={emailError}
                />
              </div>

              <Button
                variant={emailButtonVariant}
                height="default"
                onClick={handleCheckEmail}
                disabled={emailButtonDisabled}
                isLoading={isCheckingEmail}
                className="shrink-0 whitespace-nowrap"
              >
                확인
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <AuthInput
                  type="text"
                  value={emailCode}
                  onChange={handleChangeEmailCode}
                  placeholder="인증 코드 입력"
                  hasError={emailCodeError}
                />
              </div>

              <Button
                variant={sendCodeButtonVariant}
                height="default"
                onClick={handleSendCode}
                disabled={sendCodeButtonDisabled}
                isLoading={isSendingCode}
                className="shrink-0 whitespace-nowrap"
              >
                인증 요청
              </Button>

              <Button
                variant={verifyCodeButtonVariant}
                height="default"
                onClick={handleVerifyCode}
                disabled={verifyCodeButtonDisabled}
                isLoading={isVerifyingCode}
                className="shrink-0 whitespace-nowrap"
              >
                확인
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AuthInput
              type="password"
              value={password}
              onChange={handleChangePassword}
              placeholder="새 비밀번호를 입력해 주세요"
              hasError={passwordError}
            />

            <AuthInput
              type="password"
              value={passwordCheck}
              onChange={handleChangePasswordCheck}
              placeholder="비밀번호를 다시 입력해 주세요"
              hasError={passwordCheckError}
            />

            <p className="text-xs text-gray-500">
              비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 포함해야 해요.
            </p>
          </div>
        )}
      </section>

      <div className="sticky bottom-0 w-full border-t border-gray-100 bg-white px-5 py-4">
        {step === 'email' ? (
          <Button
            fullWidth
            variant="primary"
            height="cta"
            onClick={handleNext}
            disabled={!isEmailValid}
          >
            다음
          </Button>
        ) : (
          <Button
            fullWidth
            variant="primary"
            height="cta"
            onClick={handlePasswordReset}
            disabled={!isPasswordValid}
            isLoading={isLoading}
          >
            비밀번호 변경하기
          </Button>
        )}
      </div>
    </>
  );
}
