'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import AuthInput from '../../_components/AuthInput';
import { usePasswordReset } from '@/features/auth/hooks/usePasswordReset';
import { analyzePassword, validatePassword } from '@/features/auth/validators/authValidators';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';

type PasswordResetFormProps = {
  from?: string;
};

export default function PasswordResetForm({ from }: PasswordResetFormProps) {
  const router = useRouter();
  const showDialog = useDialogStore((state) => state.showDialog);
  const {
    inputs,
    status,
    step,
    actions,
    isLoading,
    isCheckingEmail,
    isSendingCode,
    isVerifyingCode,
    isResetting,
    handleCheckEmail,
    handleSendCode,
    handleVerifyCode,
    handleReset,
  } = usePasswordReset();

  useEffect(() => {
    actions.reset();

    return () => {
      actions.reset();
    };
  }, [actions]);

  useEffect(() => {
    if (
      !status.isCodeSent ||
      status.isCodeVerified ||
      status.remainingSeconds <= 0 ||
      status.error === 'CODE_LIMIT_EXCEEDED'
    )
      return;
    const timer = setInterval(() => actions.tick(), 1000);
    return () => clearInterval(timer);
  }, [status.isCodeSent, status.isCodeVerified, status.remainingSeconds, status.error, actions]);

  const onResetSubmit = async () => {
    const analysis = analyzePassword(inputs.pass);

    if (!analysis.isValid) {
      actions.setStatus({ error: 'INVALID_PASSWORD_FORMAT' });
      return;
    }

    if (inputs.pass !== inputs.passCheck) {
      actions.setStatus({ error: 'PASSWORD_MISMATCH' });
      return;
    }

    const isSuccess = await handleReset();

    if (isSuccess) {
      showDialog({
        title: '비밀번호 변경',
        content: '비밀번호가 성공적으로 변경되었어요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {
          router.push('/sign-in');
        },
      });
    }
  };

  const moveToPasswordStep = () => {
    if (isLoading) {
      return;
    }

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

  const errorMessage = status.error
    ? getErrorMessage('auth', status.error, status.errorContext ?? undefined)
    : '';
  const isFromMyPage = from === 'mypage';
  const backHref = isFromMyPage ? '/mypage' : '/sign-in';
  const backLabel = isFromMyPage ? '마이페이지로 돌아가기' : '로그인 화면으로 돌아가기';

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col gap-4">
        <PageHeader
          title="비밀번호 재설정"
          description={
            step === 'email'
              ? '학교 이메일과 인증 코드를 입력해 주세요.'
              : '새로운 비밀번호를 입력해 주세요.'
          }
          backHref={backHref}
          backLabel={backLabel}
        />

        {step === 'email' ? (
          <div className="flex flex-col gap-4">
            <div className="flex">
              <div className="min-w-0 flex-1">
                <SchoolEmailInput
                  value={inputs.email}
                  onChange={(v) => actions.setField('email', v)}
                  placeholder="학교 Gmail 입력"
                  disabled={status.isEmailChecked}
                />
              </div>

              <Button
                color={inputs.email.trim() && !status.isEmailChecked ? 'primary' : 'gray'}
                onClick={handleCheckEmail}
                disabled={!inputs.email.trim() || status.isEmailChecked}
                isLoading={isCheckingEmail}
              >
                {status.isEmailChecked ? '확인 완료' : '확인'}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <AuthInput
                    value={inputs.code}
                    onChange={(v) => actions.setField('code', v)}
                    placeholder="인증 코드 입력"
                    disabled={!status.isCodeSent || status.isCodeVerified}
                  />
                </div>

                <Button
                  color={
                    status.isEmailChecked &&
                    !status.isCodeVerified &&
                    (status.error === 'CODE_LIMIT_EXCEEDED' ||
                      !(status.isCodeSent && status.remainingSeconds > 0))
                      ? 'primary'
                      : 'gray'
                  }
                  onClick={handleSendCode}
                  disabled={
                    !status.isEmailChecked ||
                    status.isCodeVerified ||
                    (status.isCodeSent &&
                      status.remainingSeconds > 0 &&
                      status.error !== 'CODE_LIMIT_EXCEEDED')
                  }
                  isLoading={isSendingCode}
                >
                  {(() => {
                    if (status.error === 'CODE_LIMIT_EXCEEDED') return '재전송';
                    if (!status.isCodeSent) return '인증 요청';
                    if (status.isCodeVerified) return '인증 완료';
                    if (status.remainingSeconds > 0) {
                      const m = Math.floor(status.remainingSeconds / 60);
                      const s = String(status.remainingSeconds % 60).padStart(2, '0');
                      return `${m}:${s}`;
                    }
                    return '재전송';
                  })()}
                </Button>

                <Button
                  color={inputs.code && !status.isCodeVerified ? 'primary' : 'gray'}
                  onClick={handleVerifyCode}
                  disabled={!status.isCodeSent || status.isCodeVerified || !inputs.code}
                  isLoading={isVerifyingCode}
                >
                  {status.isCodeVerified ? '완료' : '확인'}
                </Button>
              </div>
              {errorMessage && <p className="text-warning text-body pt-2">{errorMessage}</p>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <AuthInput
                type="password"
                value={inputs.pass}
                onChange={(v) => actions.setField('pass', v)}
                placeholder="새 비밀번호"
              />
              {(() => {
                const analysis = analyzePassword(inputs.pass);
                const isPassEmpty = inputs.pass.length === 0;

                return (
                  <p
                    className={`text-caption font-regular ${
                      !analysis.isValid && !isPassEmpty ? 'text-warning' : 'text-gray4'
                    }`}
                  >
                    {isPassEmpty
                      ? '8자 이상, 영문/숫자/특수문자 포함'
                      : analysis.message || '사용 가능한 비밀번호입니다.'}
                  </p>
                );
              })()}
            </div>

            <div className="flex flex-col gap-2">
              <AuthInput
                type="password"
                value={inputs.passCheck}
                onChange={(v) => actions.setField('passCheck', v)}
                placeholder="비밀번호 확인"
              />
              {inputs.passCheck.length > 0 && inputs.pass !== inputs.passCheck && (
                <p className="text-warning text-xs font-medium">비밀번호가 일치하지 않아요.</p>
              )}
            </div>
          </div>
        )}
      </section>

      <footer className="flex flex-col gap-2">
        {step === 'email' ? (
          <Button
            fullWidth
            color="primary"
            height="large"
            onClick={moveToPasswordStep}
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
              className="flex-[2]"
              height="large"
              color={
                validatePassword(inputs.pass) && inputs.pass === inputs.passCheck
                  ? 'primary'
                  : 'gray'
              }
              onClick={onResetSubmit}
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
