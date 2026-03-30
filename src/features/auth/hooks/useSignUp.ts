import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSignUpStore } from '../stores/signUpStore';
import { validatePassword, validateNickname } from '../validators/authValidators';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  sendCode,
  verifyCode,
  signUp,
} from '../api/client';
import { getErrorMessage } from '@/lib/errors/messages';
import { DepartmentType } from '@/constants/department';

export const useSignUp = () => {
  const { inputs, status, actions } = useSignUpStore();

  const handleError = (error: any, context: string) => {
    const message = getErrorMessage('signup', error, context);
    actions.setStatus({ error: message });
  };

  const checkEmailMutation = useMutation({
    mutationFn: () => checkEmailDuplicate({ email: inputs.email }),
    onSuccess: () => {
      actions.setStatus({ isEmailChecked: true, error: null });
    },
    onError: (error) => handleError(error, 'checkEmail'),
  });

  const checkNicknameMutation = useMutation({
    mutationFn: (nickname: string) => checkNicknameDuplicate({ nickname }),
    onSuccess: () => {
      actions.setStatus({ isNicknameChecked: true, error: null });
    },
    onError: (error) => handleError(error, 'checkNickname'),
  });

  const sendCodeMutation = useMutation({
    mutationFn: () =>
      sendCode({
        userEmail: `${inputs.email}@dongyang.ac.kr`,
      }),
    onSuccess: () => {
      actions.setStatus({
        isCodeSent: true,
        error: null,
        remainingSeconds: 300,
        failCount: 0, // 코드 재전송 시 실패 횟수 초기화
      });
    },
    onError: (error) => handleError(error, 'sendCode'),
  });

  const verifyCodeMutation = useMutation({
    mutationFn: () =>
      verifyCode({
        userEmail: `${inputs.email}@dongyang.ac.kr`,
        code: status.emailCode,
      }),
    onSuccess: () => {
      actions.setStatus({
        isCodeVerified: true,
        error: null,
        remainingSeconds: 0,
        failCount: 0,
      });
    },
    onError: (error) => {
      const nextFail = status.failCount + 1;
      const isLimitReached = nextFail >= 3;

      if (isLimitReached) {
        handleError('CODE_LIMIT_EXCEEDED', 'verifyCode');
        actions.setStatus({
          failCount: nextFail,
          remainingSeconds: 0,
        });
      } else {
        handleError(error, 'verifyCode');
        actions.setStatus({ failCount: nextFail });
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (payload: any) => signUp(payload),
    onSuccess: () => {
      actions.setStatus({ dialogMessage: '회원가입에 성공했습니다.' });
    },
    onError: (error) => {
      handleError(error, 'signUp');
      const message = getErrorMessage('signup', error, 'signUp');
      actions.setStatus({ dialogMessage: message });
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status.isCodeSent && status.remainingSeconds > 0 && !status.isCodeVerified) {
      timer = setInterval(() => {
        actions.tick();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status.isCodeSent, status.remainingSeconds, status.isCodeVerified, actions]);

  const isPassValid = validatePassword(inputs.password);
  const isPassMatched = inputs.password === inputs.passCheck && inputs.password !== '';
  const isNicknameValid = validateNickname(inputs.nickname);

  const isFormValid =
    status.isCodeVerified &&
    isPassValid &&
    isPassMatched &&
    status.isNicknameChecked &&
    inputs.departmentType !== '' &&
    status.agreedTerms &&
    status.agreedPrivacy;

  return {
    inputs,
    status,
    actions,
    isFormValid,
    isPassValid,
    isPassMatched,
    isNicknameValid,
    isLoading:
      signUpMutation.isPending ||
      checkEmailMutation.isPending ||
      checkNicknameMutation.isPending ||
      sendCodeMutation.isPending ||
      verifyCodeMutation.isPending,
    handleCheckEmail: () => checkEmailMutation.mutate(),
    handleSendCode: () => sendCodeMutation.mutate(),
    handleCheckNickname: () => checkNicknameMutation.mutate(inputs.nickname),
    handleVerifyCode: () => {
      if (status.failCount >= 3) {
        handleError('CODE_LIMIT_EXCEEDED', 'verifyCode');
        return;
      }
      if (status.remainingSeconds <= 0 && !status.isCodeVerified) {
        handleError('EXPIRED_CODE', 'verifyCode');
        return;
      }

      verifyCodeMutation.mutate();
    },
    handleSignUp: () => {
      if (!isFormValid) return;

      const { email, password, nickname, departmentType } = inputs;

      const finalPayload = {
        email: `${email}@dongyang.ac.kr`,
        password: password,
        nickname: nickname,
        departmentType: departmentType as DepartmentType,
      };

      signUpMutation.mutate(finalPayload);
    },
  };
};
