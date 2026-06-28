import Button from '@/components/ui/Button';
import type {
  PasswordResetInputs,
  PasswordResetStatus,
} from '@/features/auth/stores/passwordResetStore';
import SchoolEmailInput from '../common/SchoolEmailInput';
import AuthInput from '@/features/auth/components/common/AuthInput';

type EmailVerificationStepProps = {
  inputs: PasswordResetInputs;
  status: PasswordResetStatus;
  isCheckingEmail: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  onChangeField: (key: keyof PasswordResetInputs, value: string) => void;
  onCheckEmail: () => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
};

export default function EmailVerificationStep({
  inputs,
  status,
  isCheckingEmail,
  isSendingCode,
  isVerifyingCode,
  onChangeField,
  onCheckEmail,
  onSendCode,
  onVerifyCode,
}: EmailVerificationStepProps) {
  const trimmedEmail = inputs.email.trim();
  const trimmedCode = inputs.code.trim();
  const isCodeLimitExceeded = status.error === 'CODE_LIMIT_EXCEEDED';
  const isCodeTimerRunning = status.isCodeSent && status.remainingSeconds > 0;

  const canCheckEmail = !!trimmedEmail && !status.isEmailChecked;
  const canSendCode =
    status.isEmailChecked && !status.isCodeVerified && (isCodeLimitExceeded || !isCodeTimerRunning);
  const canVerifyCode = status.isCodeSent && !status.isCodeVerified && !!trimmedCode;

  const checkEmailColor = canCheckEmail ? 'primary' : 'gray';
  const sendCodeColor = canSendCode ? 'primary' : 'gray';
  const verifyCodeColor = trimmedCode && !status.isCodeVerified ? 'primary' : 'gray';

  const checkEmailText = status.isEmailChecked ? '확인 완료' : '확인';
  const verifyCodeText = status.isCodeVerified ? '완료' : '확인';

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remaining}`;
  };

  const sendCodeText = isCodeLimitExceeded
    ? '재전송'
    : !status.isCodeSent
      ? '인증 요청'
      : status.isCodeVerified
        ? '인증 완료'
        : isCodeTimerRunning
          ? formatRemainingTime(status.remainingSeconds)
          : '재전송';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <SchoolEmailInput
            value={inputs.email}
            onChange={(val) => onChangeField('email', val)}
            placeholder="학교 Gmail 입력"
            disabled={status.isEmailChecked}
          />
        </div>
        <Button
          color={checkEmailColor}
          onClick={onCheckEmail}
          disabled={!canCheckEmail}
          isLoading={isCheckingEmail}
        >
          {checkEmailText}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <AuthInput
              value={inputs.code}
              onChange={(val) => onChangeField('code', val)}
              placeholder="인증 코드 입력"
              disabled={!status.isCodeSent || status.isCodeVerified}
            />
          </div>
          <Button
            color={sendCodeColor}
            onClick={onSendCode}
            disabled={!canSendCode}
            isLoading={isSendingCode}
          >
            {sendCodeText}
          </Button>
          <Button
            color={verifyCodeColor}
            onClick={onVerifyCode}
            disabled={!canVerifyCode}
            isLoading={isVerifyingCode}
          >
            {verifyCodeText}
          </Button>
        </div>
      </div>
    </div>
  );
}
