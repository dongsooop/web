import { useMutation } from '@tanstack/react-query';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  sendCode,
  signUp,
  verifyCode,
} from '@/features/auth/client/auth.api';
import type {
  SignUpInputs,
  SignUpStore,
} from '@/features/auth/stores/signUpStore';
import { buildSchoolEmail } from '@/features/auth/validators/authValidators';
import { ApiError } from '@/lib/api/apiError';

function getErrorKey(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function useSignUpMutations(actions: SignUpStore['actions']) {
  const emailCheck = useMutation({
    mutationFn: (email: string) => checkEmailDuplicate({ email }),
    onSuccess: () =>
      actions.setStatus({ isEmailChecked: true, errorKey: null, errorContext: null }),
    onError: (error) => {
      const errorKey =
        error instanceof ApiError && error.status === HttpStatusCode.CONFLICT
          ? 'DUPLICATE_EMAIL'
          : getErrorKey(error);

      actions.setStatus({
        errorKey,
        errorContext: 'checkEmail',
      });
    },
  });

  const nicknameCheck = useMutation({
    mutationFn: (nickname: string) => checkNicknameDuplicate({ nickname }),
    onSuccess: () =>
      actions.setStatus({ isNicknameChecked: true, errorKey: null, errorContext: null }),
    onError: (error) => {
      const errorKey =
        error instanceof ApiError && error.status === HttpStatusCode.CONFLICT
          ? 'DUPLICATE_NICKNAME'
          : getErrorKey(error);

      actions.setStatus({
        errorKey,
        errorContext: 'checkNickname',
      });
    },
  });

  const sendCodeMut = useMutation({
    mutationFn: (email: string) => sendCode({ userEmail: buildSchoolEmail(email) }),
    onSuccess: () => {
      actions.setStatus({
        isCodeSent: true,
        errorKey: null,
        errorContext: null,
        remainingSeconds: 300,
        failCount: 0,
      });
    },
    onError: (error) => {
      const errorKey =
        error instanceof ApiError && error.status === HttpStatusCode.BAD_REQUEST
          ? 'EMAIL_NOT_FOUND'
          : getErrorKey(error);

      actions.setStatus({
        errorKey,
        errorContext: 'sendCode',
      });
    },
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
        errorKey: null,
        errorContext: null,
        remainingSeconds: 0,
        failCount: 0,
      });
    },
    onError: (error) => {
      const errorKey =
        error instanceof ApiError && error.status === HttpStatusCode.BAD_REQUEST
          ? 'INVALID_VERIFY_CODE'
          : getErrorKey(error);

      actions.setStatus({
        errorKey,
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
      actions.setStatus({ dialogMessage: '회원가입에 성공했습니다.' });
    },
    onError: (error) => {
      const errorKey =
        error instanceof ApiError && error.status === HttpStatusCode.CONFLICT
          ? 'DUPLICATE_EMAIL'
          : getErrorKey(error);

      actions.setStatus({
        errorKey,
        errorContext: 'signUp',
      });
    },
  });

  return {
    emailCheck,
    nicknameCheck,
    sendCode: sendCodeMut,
    verifyCode: verifyCodeMut,
    signUp: signUpMut,
  };
}
