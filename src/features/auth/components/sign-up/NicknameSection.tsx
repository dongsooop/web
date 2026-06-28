import Button from '@/components/ui/Button';
import { FieldLegend } from '@/components/ui/FieldTitle';
import AuthInput from '@/features/auth/components/common/AuthInput';
import { analyzeNickname, validateNickname } from '@/features/auth/validators/authValidators';

type NicknameSectionProps = {
  nickname: string;
  isError: boolean;
  errorMessage: string;
  isChecked: boolean;
  isChecking: boolean;
  onChange: (value: string) => void;
  onCheck: () => void;
};

export default function NicknameSection({
  nickname,
  isError,
  errorMessage,
  isChecked,
  isChecking,
  onChange,
  onCheck,
}: NicknameSectionProps) {
  const isValid = validateNickname(nickname);
  const canCheck = isValid && !isChecked && !isChecking;
  let guideText = '2~8자 (특수문자 제외)';

  if (isError) {
    guideText = errorMessage;
  } else if (isChecked) {
    guideText = '사용 가능한 닉네임이에요';
  } else if (nickname.length > 0) {
    const result = analyzeNickname(nickname);
    guideText = result.isValid ? '중복 확인이 필요해요' : result.message;
  }

  const guideTone = isError ? 'text-warning' : isChecked ? 'text-primary' : 'text-gray4';

  return (
    <fieldset className="flex flex-col gap-4 px-4">
      <FieldLegend
        required
        description={
          <span
            className={`text-caption font-regular whitespace-pre-line transition-colors ${guideTone}`}
          >
            {guideText}
          </span>
        }
      >
        닉네임
      </FieldLegend>

      <div className="flex gap-2">
        <div className="flex-1">
          <AuthInput value={nickname} onChange={onChange} placeholder="닉네임" hasError={isError} />
        </div>
        <Button
          type="button"
          color={canCheck ? 'primary' : 'gray'}
          className="h-11 shrink-0 px-4"
          onClick={onCheck}
          disabled={!canCheck}
          isLoading={isChecking}
        >
          {isChecked ? '확인 완료' : '중복 검사'}
        </Button>
      </div>
    </fieldset>
  );
}
