import { useMutation } from '@tanstack/react-query';
import {
  checkNicknameDuplicate,
  sendCode,
  signUp,
  verifyCode,
} from '@/features/auth/client/auth.api';
import { checkSignUpEmail } from '@/features/auth/lib/emailCheck';
import type {
  SignUpInputs,
  SignUpStatus,
  SignUpStore,
} from '@/features/auth/stores/signUpStore';
import { buildSchoolEmail } from '@/features/auth/validators/authValidators';

export function useSignUpMutations(
  actions: SignUpStore['actions'],
  status: SignUpStatus,
  email: SignUpInputs['email'],
) {
  const emailCheck = useMutation({
    mutationFn: (email: string) => checkSignUpEmail(email),
    onSuccess: (_, requestedEmail) => {
      if (email !== requestedEmail) {
        return;
      }

      actions.setStatus({ isEmailChecked: true, error: null, errorContext: null });
    },
    onError: (error) => actions.setStatus({ error, errorContext: 'checkEmail' }),
  });

  const nicknameCheck = useMutation({
    mutationFn: (nickname: string) => checkNicknameDuplicate({ nickname }),
    onSuccess: () =>
      actions.setStatus({ isNicknameChecked: true, error: null, errorContext: null }),
    onError: (error) => actions.setStatus({ error, errorContext: 'checkNickname' }),
  });

  const sendCodeMut = useMutation({
    mutationFn: (email: string) => sendCode({ userEmail: buildSchoolEmail(email) }),
    onSuccess: (_, requestedEmail) => {
      if (email !== requestedEmail) {
        return;
      }

      actions.setStatus({
        isCodeSent: true,
        error: null,
        errorContext: null,
        remainingSeconds: 300,
        failCount: 0,
      });
    },
    onError: (error) => actions.setStatus({ error, errorContext: 'sendCode' }),
  });

  const verifyCodeMut = useMutation({
    mutationFn: ({ email, emailCode }: { email: string; emailCode: string }) =>
      verifyCode({
        userEmail: buildSchoolEmail(email),
        code: emailCode,
      }),
    onSuccess: () => {
      actions.setStatus({
        isCodeVerified: true,
        error: null,
        errorContext: null,
        remainingSeconds: 0,
        failCount: 0,
      });
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

  const signUpMut = useMutation({
    mutationFn: (inputs: SignUpInputs) =>
      signUp({
        email: buildSchoolEmail(inputs.email),
        password: inputs.pwd,
        nickname: inputs.nickname,
        departmentType: inputs.departmentType,
      }),
    onSuccess: () => {
      actions.setStatus({
        dialogMessage: '회원가입에 성공했습니다.',
        dialogType: 'success',
      });
    },
    onError: (error) => actions.setStatus({ error, errorContext: 'signUp' }),
  });

  return {
    emailCheck,
    nicknameCheck,
    sendCode: sendCodeMut,
    verifyCode: verifyCodeMut,
    signUp: signUpMut,
  };
}
