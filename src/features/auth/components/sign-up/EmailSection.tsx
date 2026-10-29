import Button from '@/components/ui/Button';
import { FieldLegend } from '@/components/ui/FieldTitle';
import AuthInput from '@/features/auth/components/common/AuthInput';
import SchoolEmailInput from '@/features/auth/components/common/SchoolEmailInput';
import type { SignUpInputs, SignUpStatus } from '@/features/auth/stores/signUpStore';

type EmailSectionProps = {
  email: SignUpInputs['email'];
  code: SignUpStatus['emailCode'];
  status: SignUpStatus;
  isError: boolean;
  errorMessage: string;
  isCheckingEmail: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  onEmailChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onCheckEmail: () => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  timerText: string;
};

export default function EmailSection({
  email,
  code,
  status,
  isError,
  errorMessage,
  isCheckingEmail,
  isSendingCode,
  isVerifyingCode,
  onEmailChange,
  onCodeChange,
  onCheckEmail,
  onSendCode,
  onVerifyCode,
  timerText,
}: EmailSectionProps) {
  const isBusy = isCheckingEmail || isSendingCode || isVerifyingCode;
  const trimmedEmail = email.trim();
  const trimmedCode = code.trim();

  const isTimeOut = status.isCodeSent && status.remainingSeconds <= 0;
  const isCountOver = status.failCount >= 3;
  const isCodeLocked = isTimeOut || isCountOver;

  const canCheckEmail = !!trimmedEmail && !status.isEmailChecked && !isBusy;

  const canSendCode =
    status.isEmailChecked &&
    !status.isCodeVerified &&
    !(status.isCodeSent && status.remainingSeconds > 0 && status.failCount < 3) &&
    !isBusy;

  const canVerifyCode =
    status.isCodeSent && !status.isCodeVerified && !!trimmedCode && !isCodeLocked && !isBusy;

  const emailGuideTone = isError ? 'text-warning' : 'text-gray4';
  const emailGuideText = isError ? errorMessage : '동양미래대학교 Gmail을 입력해주세요.';

  const checkEmailText = status.isEmailChecked ? '확인 완료' : '중복 검사';
  const verifyCodeText = status.isCodeVerified ? '완료' : '확인';

  return (
    <fieldset className="flex flex-col gap-4 px-4">
      <FieldLegend
        required
        description={
          <span
            className={`text-caption font-regular whitespace-pre-line transition-colors ${emailGuideTone}`}
          >
            {emailGuideText}
          </span>
        }
      >
        이메일
      </FieldLegend>

      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <SchoolEmailInput
            value={email}
            onChange={onEmailChange}
            placeholder="학교 Gmail"
            disabled={status.isCodeVerified}
            hasError={isError && status.errorContext !== 'verifyCode'}
          />
        </div>
        <Button
          type="button"
          color={canCheckEmail ? 'primary' : 'gray'}
          className="h-11 shrink-0 px-4"
          onClick={onCheckEmail}
          disabled={!canCheckEmail}
          isLoading={isCheckingEmail}
        >
          {checkEmailText}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <AuthInput
              value={code}
              onChange={onCodeChange}
              placeholder="인증 코드"
              disabled={status.isCodeVerified}
              hasError={isError && status.errorContext === 'verifyCode'}
            />
          </div>

          <Button
            type="button"
            color={canSendCode ? 'primary' : 'gray'}
            className="h-11 min-w-[80px] shrink-0 px-4"
            onClick={onSendCode}
            disabled={!canSendCode}
            isLoading={isSendingCode}
          >
            {timerText}
          </Button>

          <Button
            type="button"
            color={canVerifyCode ? 'primary' : 'gray'}
            className="h-11 shrink-0 px-4"
            onClick={onVerifyCode}
            disabled={!canVerifyCode}
            isLoading={isVerifyingCode}
          >
            {verifyCodeText}
          </Button>
        </div>

        {status.isCodeVerified && (
          <p className="text-caption text-primary font-regular px-1">
            이메일 인증이 완료되었습니다.
          </p>
        )}
      </div>
    </fieldset>
  );
}
