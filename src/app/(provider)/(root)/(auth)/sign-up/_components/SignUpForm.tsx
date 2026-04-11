'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import AuthInput from '../../_components/AuthInput';
import AgreementSection from './AgreeItem';
import DeptSelectModal from './DepartmentModal';
import { DEPARTMENTS } from '@/constants/department';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { ChevronDown } from 'lucide-react';
import { analyzeNickname, analyzePassword } from '@/features/auth/validators/authValidators';

const CREATE_EMAIL_URL = 'https://www.dongyang.ac.kr/dmu/4888/subview.do';

export default function SignUpForm() {
  const router = useRouter();
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const {
    inputs,
    status,
    actions,
    isFormValid,
    isPassValid,
    isPassMatched,
    isNicknameValid,
    isLoading,
    handleCheckEmail,
    handleSendCode,
    handleVerifyCode,
    handleCheckNickname,
    handleSignUp,
  } = useSignUp();

  const handleDialogConfirm = () => {
    const isSuccess = status.dialogMessage === '회원가입에 성공했습니다.';
    actions.setStatus({ dialogMessage: null });
    if (isSuccess) router.push('/sign-in');
  };

  const emailError = !!status.error?.includes('이메일');
  const authCodeError = !!status.error?.includes('인증');
  const passwordError = !!(inputs.password && !isPassValid);
  const passCheckError = !!(inputs.passCheck && !isPassMatched);
  const nicknameError = !!status.error?.includes('닉네임');

  const getPasswordGuide = () => {
    if (!inputs.password) return '영문, 숫자, 특수문자 포함 8자 이상';

    const { isValid, message } = analyzePassword(inputs.password);

    if (!isValid) return message;
    if (inputs.passCheck && !isPassMatched) return '비밀번호가 일치하지 않아요';
    if (isPassMatched) return '사용 가능한 비밀번호예요';

    return '영문, 숫자, 특수문자 포함 8자 이상';
  };

  const getNicknameGuide = () => {
    if (nicknameError) return status.error ?? undefined;
    if (status.isNicknameChecked) return '사용 가능한 닉네임이에요';
    if (inputs.nickname.length > 0) {
      const { isValid, message } = analyzeNickname(inputs.nickname);
      if (!isValid) return message;
      return '중복 확인이 필요해요';
    }
    return '2~8자 (특수문자 제외)';
  };

  return (
    <>
      <section className="flex w-full max-w-[480px] flex-col gap-10 bg-white py-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-3 px-4">
          <h1 className="text-title font-bold text-black">동숲 회원가입</h1>
          <p className="text-small font-regular text-gray4">
            동양미래대학교 Gmail(@dongyang.ac.kr)로만 가입 가능합니다.
          </p>
          <Link
            href={CREATE_EMAIL_URL}
            target="_blank"
            className="text-small font-bold text-black underline underline-offset-2"
          >
            학교 이메일 발급하러 가기
          </Link>
        </div>

        {/* 이메일 섹션 */}
        <div className="flex flex-col gap-4 px-4">
          <SectionLabel
            title="이메일"
            description={
              emailError || authCodeError
                ? (status.error ?? undefined)
                : '동양미래대학교 Gmail을 입력해주세요.'
            }
            descriptionColor={emailError || authCodeError ? 'text-warning' : 'text-gray4'}
          />

          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <SchoolEmailInput
                value={inputs.email}
                onChange={(val) => actions.setField('email', val)}
                placeholder="학교 Gmail"
                disabled={status.isCodeVerified}
                hasError={emailError}
              />
            </div>
            <Button
              variant={inputs.email.trim() && !status.isEmailChecked ? 'primary' : 'gray'}
              className="h-[44px] shrink-0 px-4"
              onClick={handleCheckEmail}
              disabled={!inputs.email.trim() || status.isEmailChecked || isLoading}
            >
              {status.isEmailChecked ? '확인 완료' : '중복 검사'}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <AuthInput
                  value={status.emailCode}
                  onChange={(val) => actions.setStatus({ emailCode: val.toUpperCase() })}
                  placeholder="인증 코드"
                  disabled={status.isCodeVerified}
                  hasError={authCodeError && !status.isCodeVerified}
                />
              </div>

              <Button
                variant={
                  !status.isCodeVerified &&
                  status.isEmailChecked &&
                  (!status.isCodeSent || status.remainingSeconds <= 0 || status.failCount >= 3)
                    ? 'primary'
                    : 'gray'
                }
                className="h-[44px] min-w-[80px] shrink-0 px-4"
                onClick={handleSendCode}
                disabled={
                  !status.isEmailChecked ||
                  status.isCodeVerified ||
                  (status.isCodeSent && status.remainingSeconds > 0 && status.failCount < 3) ||
                  isLoading
                }
              >
                {(() => {
                  if (status.isCodeVerified) return '인증 완료';
                  if (status.isCodeSent && status.remainingSeconds > 0 && status.failCount < 3) {
                    const m = Math.floor(status.remainingSeconds / 60);
                    const s = String(status.remainingSeconds % 60).padStart(2, '0');
                    return `${m}:${s}`;
                  }
                  return status.isCodeSent ? '재전송' : '인증 요청';
                })()}
              </Button>

              <Button
                variant={
                  status.isCodeSent && status.emailCode.length > 0 && !status.isCodeVerified
                    ? 'primary'
                    : 'gray'
                }
                className="h-[44px] shrink-0 px-4"
                onClick={handleVerifyCode}
                disabled={
                  !status.isCodeSent ||
                  status.isCodeVerified ||
                  status.emailCode.length === 0 ||
                  isLoading
                }
              >
                {status.isCodeVerified ? '완료' : '확인'}
              </Button>
            </div>

            {status.isCodeVerified && (
              <p className="text-small text-primary font-regular px-1">
                이메일 인증이 완료되었습니다.
              </p>
            )}
          </div>
        </div>

        {/* 비밀번호 섹션 */}
        <div className="flex flex-col gap-4 px-4">
          <SectionLabel
            title="비밀번호"
            description={getPasswordGuide()}
            descriptionColor={
              passwordError || passCheckError
                ? 'text-warning'
                : isPassMatched
                  ? 'text-primary'
                  : 'text-gray4'
            }
          />
          <AuthInput
            type="password"
            value={inputs.password}
            onChange={(val) => actions.setField('password', val)}
            placeholder="비밀번호"
            hasError={passwordError}
          />
          <AuthInput
            type="password"
            value={inputs.passCheck}
            onChange={(val) => actions.setField('passCheck', val)}
            placeholder="비밀번호 확인"
            hasError={passCheckError}
          />
        </div>

        {/* 닉네임 섹션 */}
        <div className="flex flex-col gap-4 px-4">
          <SectionLabel
            title="닉네임"
            description={getNicknameGuide()}
            descriptionColor={
              nicknameError
                ? 'text-warning'
                : status.isNicknameChecked
                  ? 'text-primary'
                  : 'text-gray4'
            }
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <AuthInput
                value={inputs.nickname}
                onChange={(val) => actions.setField('nickname', val)}
                placeholder="닉네임"
                hasError={nicknameError}
              />
            </div>
            <Button
              variant={isNicknameValid && !status.isNicknameChecked ? 'primary' : 'gray'}
              className="h-[44px] shrink-0 px-4"
              onClick={handleCheckNickname}
              disabled={!isNicknameValid || status.isNicknameChecked || isLoading}
            >
              {status.isNicknameChecked ? '확인 완료' : '중복 검사'}
            </Button>
          </div>
        </div>

        {/* 학과 섹션 */}
        <div className="flex flex-col gap-4 px-4">
          <SectionLabel title="학과" />
          <button
            type="button"
            onClick={() => setIsDeptModalOpen(true)}
            className="border-gray2 active:border-primary flex h-[48px] w-full items-center justify-between rounded-[8px] border bg-white px-4 transition-all outline-none"
          >
            <span className={`text-[16px] ${inputs.departmentType ? 'text-black' : 'text-gray3'}`}>
              {DEPARTMENTS.find((d) => d.code === inputs.departmentType)?.displayName ||
                '학과 선택'}
            </span>
            <div className="text-gray4">
              <ChevronDown size={12} strokeWidth={1.5} />
            </div>
          </button>
        </div>

        <AgreementSection
          agreedTerms={status.agreedTerms}
          agreedPrivacy={status.agreedPrivacy}
          onTermsChange={(val) => actions.setStatus({ agreedTerms: val })}
          onPrivacyChange={(val) => actions.setStatus({ agreedPrivacy: val })}
        />

        <div className="mt-4 px-4">
          {status.error && (
            <p className="text-small text-warning animate-in fade-in slide-in-from-bottom-1 font-regular mb-3 px-1 text-center">
              {status.error}
            </p>
          )}

          <Button
            fullWidth
            variant={isFormValid ? 'primary' : 'gray'}
            className="h-[52px]"
            disabled={!isFormValid}
            isLoading={isLoading}
            onClick={handleSignUp}
          >
            가입하기
          </Button>
        </div>
      </section>

      <DeptSelectModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSelect={(code) => actions.setField('departmentType', code)}
        selectedCode={inputs.departmentType}
      />
      <ConfirmDialog
        open={!!status.dialogMessage}
        title="알림"
        content={status.dialogMessage ?? ''}
        confirmText="확인"
        isSingleAction
        onConfirm={handleDialogConfirm}
      />
    </>
  );
}

function SectionLabel({
  title,
  description,
  descriptionColor = 'text-gray4',
}: {
  title: string;
  description?: string;
  descriptionColor?: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <p className="text-normal font-bold text-black">
        {title}
        <span className="text-primary"> *</span>
      </p>
      {description && (
        <p className={`text-small transition-colors ${descriptionColor}`}>{description}</p>
      )}
    </div>
  );
}
