'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import EmailVerificationStep from '@/features/auth/components/password-reset/EmailVerificationStep';
import PasswordResetStep from '@/features/auth/components/password-reset/PasswordResetStep';
import { usePasswordReset } from '@/features/auth/hooks/password-reset/usePasswordReset';
import { usePasswordResetStore } from '@/features/auth/providers/PasswordResetProvider';
import { validatePassword, analyzePassword } from '@/features/auth/validators/authValidators';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';

type PasswordResetFormProps = {
  from?: string;
};

function stepDescription(step: 'email' | 'password') {
  return step === 'email'
    ? '학교 이메일과 인증 코드를 입력해 주세요.'
    : '새로운 비밀번호를 입력해 주세요.';
}

export default function PasswordResetForm({ from }: PasswordResetFormProps) {
  const router = useRouter();
  const showDialog = useDialogStore((state) => state.showDialog);

  const step = usePasswordResetStore((state) => state.step);
  const inputs = usePasswordResetStore((state) => state.inputs);
  const status = usePasswordResetStore((state) => state.status);
  const actions = usePasswordResetStore((state) => state.actions);

  const {
    isCheckingEmail,
    isSendingCode,
    isVerifyingCode,
    isResetting,
    changeField,
    checkEmail,
    sendCode,
    verifyCode,
    resetPassword,
  } = usePasswordReset();

  const isLoading = isCheckingEmail || isSendingCode || isVerifyingCode || isResetting;

  useEffect(() => {
    actions.reset();
    return () => actions.reset();
  }, [actions]);

  useEffect(() => {
    if (
      !status.isCodeSent ||
      status.isCodeVerified ||
      status.remainingSeconds <= 0 ||
      status.error === 'CODE_LIMIT_EXCEEDED'
    )
      return;
    const timer = setInterval(actions.tick, 1000);
    return () => clearInterval(timer);
  }, [
    status.error,
    status.isCodeSent,
    status.isCodeVerified,
    status.remainingSeconds,
    actions.tick,
  ]);

  const isEmailStep = step === 'email';
  const isPasswordMatched = inputs.pwd === inputs.pwdCheck;
  const canSubmitPassword = validatePassword(inputs.pwd) && isPasswordMatched;
  const submitPasswordColor = canSubmitPassword ? 'primary' : 'gray';

  const errorMessage = useMemo(() => {
    if (!status.error) return '';
    return getErrorMessage('auth', status.error, status.errorContext ?? undefined);
  }, [status.error, status.errorContext]);

  const handleNextStepClick = () => {
    if (isLoading) return;
    if (!status.isEmailChecked) {
      showDialog({
        title: '이메일 확인 필요',
        content: '학교 이메일 인증을 먼저 완료해주세요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }
    if (!status.isCodeVerified) {
      showDialog({
        title: '인증 확인 필요',
        content: '인증 코드 확인을 먼저 완료해주세요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }
    actions.setStep('password');
  };

  const handlePasswordResetSubmit = async () => {
    if (!analyzePassword(inputs.pwd).isValid) {
      actions.setStatus({ error: 'INVALID_PASSWORD_FORMAT' });
      return;
    }
    if (!isPasswordMatched) {
      actions.setStatus({ error: 'PASSWORD_MISMATCH' });
      return;
    }

    const isSuccess = await resetPassword();
    if (isSuccess) {
      showDialog({
        title: '비밀번호 변경',
        content: '비밀번호가 성공적으로 변경되었어요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => router.push(from ?? '/sign-in'),
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col gap-4">
        <PageHeader title="비밀번호 재설정" showBackButton description={stepDescription(step)} />

        {isEmailStep ? (
          <EmailVerificationStep
            inputs={inputs}
            status={status}
            isCheckingEmail={isCheckingEmail}
            isSendingCode={isSendingCode}
            isVerifyingCode={isVerifyingCode}
            onChangeField={changeField}
            onCheckEmail={checkEmail}
            onSendCode={sendCode}
            onVerifyCode={verifyCode}
          />
        ) : (
          <PasswordResetStep
            pwd={inputs.pwd}
            pwdCheck={inputs.pwdCheck}
            onChangeField={changeField}
          />
        )}
        {errorMessage ? <p className="text-warning text-body pt-2">{errorMessage}</p> : null}
      </section>

      <footer className="flex flex-col gap-2">
        {isEmailStep ? (
          <Button
            fullWidth
            color="primary"
            height="large"
            onClick={handleNextStepClick}
            disabled={isLoading}
          >
            다음
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button color="gray" className="flex-1" onClick={() => actions.setStep('email')}>
              이전
            </Button>
            <Button
              className="flex-1"
              height="large"
              color={submitPasswordColor}
              onClick={handlePasswordResetSubmit}
              isLoading={isResetting}
            >
              비밀번호 변경하기
            </Button>
          </div>
        )}
      </footer>
    </div>
  );
}
