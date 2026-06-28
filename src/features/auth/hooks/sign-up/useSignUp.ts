import { useCallback } from 'react';
import { useSignUpStore } from '@/features/auth/stores/signUpStore';
import { useSignUpMutations } from './useSignUpMutations';

export const useSignUp = () => {
  const inputs = useSignUpStore((state) => state.inputs);
  const status = useSignUpStore((state) => state.status);
  const actions = useSignUpStore((state) => state.actions);

  const mutations = useSignUpMutations(actions);

  const changeField = useCallback(
    <K extends keyof typeof inputs>(key: K, value: (typeof inputs)[K]) => {
      actions.setField(key, value);
    },
    [actions],
  );

  const checkEmail = useCallback(
    () => mutations.emailCheck.mutate(inputs.email),
    [mutations.emailCheck, inputs.email],
  );

  const sendCode = useCallback(
    () => mutations.sendCode.mutate(inputs.email),
    [mutations.sendCode, inputs.email],
  );

  const checkNickname = useCallback(
    () => mutations.nicknameCheck.mutate(inputs.nickname),
    [mutations.nicknameCheck, inputs.nickname],
  );

  const verifyCode = useCallback(() => {
    if (status.failCount >= 3) {
      actions.setStatus({ error: 'CODE_LIMIT_EXCEEDED', errorContext: 'verifyCode' });
      return;
    }
    if (status.remainingSeconds <= 0 && !status.isCodeVerified) {
      actions.setStatus({ error: 'EXPIRED_CODE', errorContext: 'verifyCode' });
      return;
    }
    mutations.verifyCode.mutate({ email: inputs.email, emailCode: status.emailCode });
  }, [
    mutations.verifyCode,
    inputs.email,
    status.emailCode,
    status.failCount,
    status.remainingSeconds,
    status.isCodeVerified,
    actions,
  ]);

  const registerUser = useCallback(() => {
    mutations.signUp.mutate(inputs);
  }, [mutations.signUp, inputs]);

  return {
    isCheckingEmail: mutations.emailCheck.isPending,
    isSendingCode: mutations.sendCode.isPending,
    isVerifyingCode: mutations.verifyCode.isPending,
    isCheckingNickname: mutations.nicknameCheck.isPending,
    isSubmitting: mutations.signUp.isPending,
    changeField,
    checkEmail,
    sendCode,
    verifyCode,
    checkNickname,
    registerUser,
  };
};
