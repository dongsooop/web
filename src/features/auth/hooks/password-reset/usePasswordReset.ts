import { useCallback } from 'react';
import { isPasswordResetErrorKey } from '@/features/auth/lib/error';
import { usePasswordResetStore } from '@/features/auth/providers/PasswordResetProvider';
import { usePasswordResetMutations } from './usePasswordResetMutations';

export function usePasswordReset() {
  const inputs = usePasswordResetStore((state) => state.inputs);
  const status = usePasswordResetStore((state) => state.status);
  const actions = usePasswordResetStore((state) => state.actions);

  const mutations = usePasswordResetMutations(inputs, status, actions);

  const changeField = useCallback(
    (key: keyof typeof inputs, value: string) => {
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

  const verifyCode = useCallback(() => {
    if (status.failCount >= 3) {
      actions.setStatus({ error: 'CODE_LIMIT_EXCEEDED', errorContext: 'verifyCode' });
      return;
    }
    mutations.verifyCode.mutate({ email: inputs.email, code: inputs.code });
  }, [status.failCount, mutations.verifyCode, inputs.email, inputs.code, actions]);

  const resetPassword = useCallback(async () => {
    try {
      await mutations.reset.mutateAsync();
      return true;
    } catch (error) {
      actions.setStatus({
        error:
          error instanceof Error || isPasswordResetErrorKey(error)
            ? error
            : new Error('UNKNOWN_PASSWORD_RESET_ERROR'),
        errorContext: 'reset',
      });
      return false;
    }
  }, [mutations.reset, actions]);

  return {
    isCheckingEmail: mutations.emailCheck.isPending,
    isSendingCode: mutations.sendCode.isPending,
    isVerifyingCode: mutations.verifyCode.isPending,
    isResetting: mutations.reset.isPending,
    changeField,
    checkEmail,
    sendCode,
    verifyCode,
    resetPassword,
  };
}
