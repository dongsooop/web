'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AgreementSection from './AgreeItem';
import DeptSelectModal from './DepartmentModal';
import EmailSection from './EmailSection';
import PasswordSection from './PasswordSection';
import NicknameSection from './NicknameSection';
import DepartmentSection from './DepartmentSection';
import { useSignUp } from '@/features/auth/hooks/sign-up/useSignUp';
import { useSignUpStore } from '@/features/auth/providers/SignUpProvider';
import { validateNickname, validatePassword } from '@/features/auth/validators/authValidators';
import { getErrorMessage } from '@/lib/errors/messages';

const CREATE_EMAIL_URL = 'https://www.dongyang.ac.kr/dmu/4888/subview.do';

export default function SignUpForm() {
  const router = useRouter();
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const inputs = useSignUpStore((state) => state.inputs);
  const status = useSignUpStore((state) => state.status);
  const actions = useSignUpStore((state) => state.actions);

  const {
    isCheckingEmail,
    isSendingCode,
    isVerifyingCode,
    isCheckingNickname,
    isSubmitting,
    changeField,
    checkEmail,
    sendCode,
    verifyCode,
    checkNickname,
    registerUser,
  } = useSignUp();

  useEffect(() => {
    if (
      !status.isCodeSent ||
      status.isCodeVerified ||
      status.remainingSeconds <= 0 ||
      status.failCount >= 3
    )
      return;
    const timer = setInterval(actions.tick, 1000);
    return () => clearInterval(timer);
  }, [
    actions.tick,
    status.failCount,
    status.isCodeSent,
    status.isCodeVerified,
    status.remainingSeconds,
  ]);

  const isLoading =
    isCheckingEmail || isSendingCode || isVerifyingCode || isCheckingNickname || isSubmitting;

  const isEmailSectionError =
    status.errorContext === 'checkEmail' ||
    status.errorContext === 'sendCode' ||
    status.errorContext === 'verifyCode';
  const isNicknameSectionError = status.errorContext === 'checkNickname';

  const domainErrorMessage = useMemo(() => {
    if (!status.error) return '';
    return getErrorMessage('signup', status.error, status.errorContext ?? undefined);
  }, [status.error, status.errorContext]);

  const isPassValid = validatePassword(inputs.pwd);
  const isPassMatched = inputs.pwd === inputs.pwdCheck;
  const isNicknameValid = validateNickname(inputs.nickname);

  const canSubmit =
    status.isEmailChecked &&
    status.isCodeVerified &&
    status.isNicknameChecked &&
    isPassValid &&
    isPassMatched &&
    isNicknameValid &&
    inputs.departmentType !== 'UNKNOWN' &&
    status.agreedTerms &&
    status.agreedPrivacy &&
    status.remainingSeconds >= 0 &&
    status.failCount < 3;

  const submitColor = canSubmit ? 'primary' : 'gray';

  const closeDialog = () => {
    const isSuccess = status.dialogMessage === '회원가입에 성공했습니다.';
    actions.setStatus({ dialogMessage: null });
    if (isSuccess) router.push('/sign-in');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;
    registerUser();
  };

  const formatTimerText = useMemo(() => {
    if (status.isCodeVerified) return '인증 완료';
    if (status.isCodeSent && status.remainingSeconds > 0) {
      const m = Math.floor(status.remainingSeconds / 60);
      const s = String(status.remainingSeconds % 60).padStart(2, '0');
      return `${m}:${s}`;
    }
    return status.isCodeSent ? '재전송' : '인증 요청';
  }, [status.isCodeVerified, status.isCodeSent, status.remainingSeconds, status.failCount]);

  return (
    <div className="flex w-full justify-center bg-white px-4 py-6">
      <form className="max-w-form flex w-full flex-col gap-10 bg-white py-6" onSubmit={submit}>
        <header className="flex flex-col gap-3 px-4">
          <h1 className="text-title font-bold text-black">동숲 회원가입</h1>
          <p className="text-caption font-regular text-gray4">
            동양미래대학교 Gmail(@dongyang.ac.kr)로만 가입 가능해요.
          </p>
          <Link
            href={CREATE_EMAIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption font-bold text-black underline underline-offset-2"
          >
            학교 이메일 발급하러 가기
          </Link>
        </header>

        <EmailSection
          email={inputs.email}
          code={status.emailCode}
          status={status}
          isError={isEmailSectionError}
          errorMessage={domainErrorMessage}
          isCheckingEmail={isCheckingEmail}
          isSendingCode={isSendingCode}
          isVerifyingCode={isVerifyingCode}
          onEmailChange={(value) => changeField('email', value)}
          onCodeChange={(value) => actions.setStatus({ emailCode: value.toUpperCase() })}
          onCheckEmail={checkEmail}
          onSendCode={sendCode}
          onVerifyCode={verifyCode}
          timerText={formatTimerText}
        />

        <PasswordSection
          pwd={inputs.pwd}
          pwdCheck={inputs.pwdCheck}
          onPwdChange={(value) => changeField('pwd', value)}
          onPwdCheckChange={(value) => changeField('pwdCheck', value)}
        />

        <NicknameSection
          nickname={inputs.nickname}
          isError={isNicknameSectionError}
          errorMessage={domainErrorMessage}
          isChecked={status.isNicknameChecked}
          isChecking={isCheckingNickname}
          onChange={(value) => changeField('nickname', value)}
          onCheck={checkNickname}
        />

        <DepartmentSection value={inputs.departmentType} onOpen={() => setIsDeptModalOpen(true)} />

        <AgreementSection
          agreedTerms={status.agreedTerms}
          agreedPrivacy={status.agreedPrivacy}
          onTermsChange={(value) => actions.setStatus({ agreedTerms: value })}
          onPrivacyChange={(value) => actions.setStatus({ agreedPrivacy: value })}
        />

        <footer className="mt-4 px-4">
          <Button
            fullWidth
            type="submit"
            color={submitColor}
            height="xlarge"
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            가입하기
          </Button>
        </footer>
      </form>

      <DeptSelectModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSelect={(code) => changeField('departmentType', code)}
        selectedCode={inputs.departmentType}
      />
      <ConfirmDialog
        open={!!status.dialogMessage}
        title="알림"
        content={status.dialogMessage ?? ''}
        confirm="확인"
        isSingleAction
        onConfirm={closeDialog}
      />
    </div>
  );
}
