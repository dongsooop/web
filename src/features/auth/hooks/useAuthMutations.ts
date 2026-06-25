import { useMutation } from '@tanstack/react-query';
import { checkPasswordResetEmail as checkEmailApi } from '../api/emailValidation';
import { sendPasswordResetCode as sendCodeApi, verifyPasswordResetCode as verifyCodeApi, resetPassword } from '../client/auth.api';
import { buildSchoolEmail } from '../validators/authValidators';
import type {
  PasswordResetInputs,
  PasswordResetStatus,
  PasswordResetStore,
} from '../stores/passwordResetStore';

export function useAuthMutations(
  inputs: PasswordResetInputs,
  status: PasswordResetStatus,
  actions: PasswordResetStore['actions'],
) {
  const emailCheck = useMutation({
    mutationFn: (email: string) => checkEmailApi(buildSchoolEmail(email)),
    onSuccess: (res) => {
      actions.setStatus({
        isEmailChecked: res.ok,
        error: res.ok ? null : res.reason,
        errorContext: 'emailCheck',
      });
    },
    onError: (error) => actions.setStatus({ error, errorContext: 'emailCheck' }),
  });

  const sendCode = useMutation({
    mutationFn: (email: string) => sendCodeApi({ userEmail: buildSchoolEmail(email) }),
    onSuccess: () => {
      actions.setStatus({
        isCodeSent: true,
        remainingSeconds: 300,
        failCount: 0,
        error: null,
        errorContext: null,
      });
    },
    onError: (error) => actions.setStatus({ error, errorContext: 'sendCode' }),
  });

  const verifyCode = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyCodeApi({ userEmail: buildSchoolEmail(email), code: code.trim() }),
    onSuccess: () => {
      actions.setStatus({ isCodeVerified: true, error: null, errorContext: null });
    },
    onError: (error) => {
      const nextFailCount = status.failCount + 1;
      const isCodeLimitExceeded = nextFailCount >= 3;

      actions.setStatus({
        failCount: nextFailCount,
        error: isCodeLimitExceeded ? 'CODE_LIMIT_EXCEEDED' : error,
        errorContext: 'verifyCode',
      });
    },
  });

  const reset = useMutation({
    mutationFn: () =>
      resetPassword({ email: buildSchoolEmail(inputs.email), password: inputs.pwd }),
  });

  return { emailCheck, sendCode, verifyCode, reset };
}
