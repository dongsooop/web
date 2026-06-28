import { FieldLegend } from '@/components/ui/FieldTitle';
import AuthInput from '@/features/auth/components/common/AuthInput';
import { analyzePassword } from '@/features/auth/validators/authValidators';

type PasswordSectionProps = {
  pwd: string;
  pwdCheck: string;
  onPwdChange: (value: string) => void;
  onPwdCheckChange: (value: string) => void;
};

export default function PasswordSection({
  pwd,
  pwdCheck,
  onPwdChange,
  onPwdCheckChange,
}: PasswordSectionProps) {
  const passwordResult = analyzePassword(pwd);
  const isPasswordEmpty = pwd.length === 0;
  const isPasswordMatched = pwd === pwdCheck;
  const showPasswordError = !isPasswordEmpty && !passwordResult.isValid;
  const showPasswordMismatch = pwdCheck.length > 0 && !isPasswordMatched;
  const showPasswordWarning = showPasswordError || showPasswordMismatch;
  const showPasswordSuccess = passwordResult.isValid && isPasswordMatched;

  const guideText = isPasswordEmpty
    ? '영문, 숫자, 특수문자 포함 8자 이상'
    : !passwordResult.isValid
      ? passwordResult.message
      : showPasswordMismatch
        ? '비밀번호가 일치하지 않아요'
        : isPasswordMatched
          ? '사용 가능한 비밀번호예요'
          : '영문, 숫자, 특수문자 포함 8자 이상';

  const guideTone = isPasswordEmpty
    ? 'text-gray4'
    : showPasswordError || showPasswordMismatch
      ? 'text-warning'
      : isPasswordMatched
        ? 'text-primary'
        : 'text-gray4';

  return (
    <fieldset className="flex flex-col gap-4 px-4">
      <FieldLegend
        required
        description={
          <span className={`text-caption font-regular transition-colors ${guideTone}`}>
            {guideText}
          </span>
        }
      >
        비밀번호
      </FieldLegend>

      <div className="flex flex-col gap-2">
        <AuthInput
          type="password"
          value={pwd}
          onChange={onPwdChange}
          placeholder="비밀번호"
          hasError={showPasswordWarning}
          isSuccess={showPasswordSuccess}
        />
        <AuthInput
          type="password"
          value={pwdCheck}
          onChange={onPwdCheckChange}
          placeholder="비밀번호 확인"
          hasError={showPasswordWarning}
          isSuccess={showPasswordSuccess}
        />
      </div>
    </fieldset>
  );
}
