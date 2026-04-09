import { useMutation } from '@tanstack/react-query';
import { buildSchoolEmail } from '../validators/authValidators';
import { checkPasswordResetEmail } from '../api/emailValidation';
import {
  resetPassword,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '../client/auth.api';
import { usePasswordResetStore } from '../stores/passwordResetStore';

export const usePasswordReset = () => {
  const { inputs, status, step, actions } = usePasswordResetStore();

  // 이메일 존재 여부 확인
  const emailCheckMutation = useMutation({
    mutationFn: (email: string) => checkPasswordResetEmail(buildSchoolEmail(email)),
    onSuccess: (res) => {
      if (res.ok) {
        actions.setStatus({ isEmailChecked: true, error: null, errorContext: null });
      } else {
        actions.setStatus({ 
          isEmailChecked: false, 
          error: res.reason,
          errorContext: 'emailCheck' 
        });
      }
    },
    onError: (err) => actions.setStatus({ error: err, errorContext: 'emailCheck' }),
  });

  // 인증 코드 발송
  const sendCodeMutation = useMutation({
    mutationFn: (email: string) => sendPasswordResetCode({ userEmail: buildSchoolEmail(email) }),
    onSuccess: () => {
      actions.setStatus({ 
        isCodeSent: true, 
        remainingSeconds: 300, 
        failCount: 0, 
        error: null, 
        errorContext: null 
      });
    },
    onError: (err) => actions.setStatus({ error: err, errorContext: 'sendCode' }),
  });

  // 인증 코드 검증 (프론트엔드 3회 제한 로직)
  const verifyCodeMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      verifyPasswordResetCode({ userEmail: buildSchoolEmail(email), code: code.trim() }),
    onSuccess: () => {
      actions.setStatus({ isCodeVerified: true, error: null, errorContext: null });
    },
    onError: (err) => {
      const nextFail = status.failCount + 1;
      const isLimitReached = nextFail >= 3;

      actions.setStatus({ 
        failCount: nextFail, 
        error: isLimitReached ? 'CODE_LIMIT_EXCEEDED' : err, 
        errorContext: 'verifyCode' 
      });
    },
  });

  // 비밀번호 재설정 실행
  const resetMutation = useMutation({
    mutationFn: () => resetPassword({ 
      email: buildSchoolEmail(inputs.email), 
      password: inputs.pass 
    }),
  });

  return {
    inputs,
    status,
    step,
    actions,
    isLoading: 
      emailCheckMutation.isPending || 
      sendCodeMutation.isPending || 
      verifyCodeMutation.isPending || 
      resetMutation.isPending,
      
    handleCheckEmail: () => emailCheckMutation.mutate(inputs.email),
    handleSendCode: () => sendCodeMutation.mutate(inputs.email),
    
    // 실행 전 실패 횟수 체크
    handleVerifyCode: () => {
      if (status.failCount >= 3) {
        actions.setStatus({ error: 'CODE_LIMIT_EXCEEDED', errorContext: 'verifyCode' });
        return;
      }
      verifyCodeMutation.mutate({ email: inputs.email, code: inputs.code });
    },

    handleReset: async () => {
      try {
        await resetMutation.mutateAsync();
        return true;
      } catch (err) {
        actions.setStatus({ error: err, errorContext: 'reset' });
        return false;
      }
    },
  };
};