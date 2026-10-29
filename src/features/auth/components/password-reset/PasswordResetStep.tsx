import AuthInput from '../common/AuthInput';
import { analyzePassword } from '@/features/auth/validators/authValidators';

type PasswordResetStepProps = {
  pwd: string;
  pwdCheck: string;
  onChangeField: (key: 'pwd' | 'pwdCheck', value: string) => void;
};

export default function PasswordResetStep({
  pwd,
  pwdCheck,
  onChangeField,
}: PasswordResetStepProps) {
  const passwordResult = analyzePassword(pwd);
  const isPasswordEmpty = pwd.length === 0;
  const isPasswordMatched = pwd === pwdCheck;
  const passError = !isPasswordEmpty && !passwordResult.isValid;
  const checkError = pwdCheck.length > 0 && !isPasswordMatched;
  const passSuccess = passwordResult.isValid;
  const checkSuccess =
    pwdCheck.length > 0 && passwordResult.isValid && isPasswordMatched;

  const passwordGuideText = isPasswordEmpty
    ? '8자 이상, 영문/숫자/특수문자 포함'
    : passwordResult.message || '사용 가능한 비밀번호입니다.';

  const passwordGuideTone = passError ? 'text-warning' : 'text-gray4';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <AuthInput
          type="password"
          value={pwd}
          onChange={(val) => onChangeField('pwd', val)}
          placeholder="새 비밀번호"
          hasError={passError}
          isSuccess={passSuccess}
        />
        <p className={`text-caption font-regular ${passwordGuideTone}`}>{passwordGuideText}</p>
      </div>

      <div className="flex flex-col gap-2">
        <AuthInput
          type="password"
          value={pwdCheck}
          onChange={(val) => onChangeField('pwdCheck', val)}
          placeholder="비밀번호 확인"
          hasError={checkError}
          isSuccess={checkSuccess}
        />
        {checkError ? (
          <p className="text-warning text-xs font-medium">비밀번호가 일치하지 않아요.</p>
        ) : null}
      </div>
    </div>
  );
}
