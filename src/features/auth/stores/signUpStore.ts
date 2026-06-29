import { createStore } from 'zustand/vanilla';
import type { DepartmentType } from '@/constants/department';
import type { SignUpErrorContext, SignUpRuntimeError } from '@/features/auth/types/error';

export type SignUpInputs = {
  email: string;
  pwd: string;
  pwdCheck: string;
  nickname: string;
  departmentType: DepartmentType;
};

export type SignUpStatus = {
  isEmailChecked: boolean;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  isNicknameChecked: boolean;
  error: SignUpRuntimeError;
  errorContext: SignUpErrorContext | null;
  remainingSeconds: number;
  emailCode: string;
  dialogMessage: string | null;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  failCount: number;
};

type SignUpActions = {
  setField: <K extends keyof SignUpInputs>(field: K, value: SignUpInputs[K]) => void;
  setStatus: (status: Partial<SignUpStatus>) => void;
  tick: () => void;
};

export type SignUpStore = {
  inputs: SignUpInputs;
  status: SignUpStatus;
  actions: SignUpActions;
};

const initialInputs: SignUpInputs = {
  email: '',
  pwd: '',
  pwdCheck: '',
  nickname: '',
  departmentType: 'UNKNOWN',
};

const initialStatus: SignUpStatus = {
  isEmailChecked: false,
  isCodeSent: false,
  isCodeVerified: false,
  isNicknameChecked: false,
  error: null,
  errorContext: null,
  remainingSeconds: 0,
  emailCode: '',
  dialogMessage: null,
  agreedTerms: false,
  agreedPrivacy: false,
  failCount: 0,
};

export const initialSignUpState = {
  inputs: initialInputs,
  status: initialStatus,
};

export function createSignUpStore() {
  return createStore<SignUpStore>()((set) => ({
    ...initialSignUpState,
    actions: {
      setField: (field, value) =>
        set((state) => {
          const isEmailField = field === 'email';
          const isLimitError = state.status.error === 'CODE_LIMIT_EXCEEDED';
          const nextError = isEmailField ? null : isLimitError ? 'CODE_LIMIT_EXCEEDED' : null;

          return {
            inputs: { ...state.inputs, [field]: value },
            status: {
              ...state.status,
              error: nextError,
              errorContext: nextError ? state.status.errorContext : null,
              ...(isEmailField
                ? {
                    isEmailChecked: false,
                    isCodeSent: false,
                    isCodeVerified: false,
                    emailCode: '',
                    failCount: 0,
                    remainingSeconds: 0,
                  }
                : {}),
              ...(field === 'nickname' ? { isNicknameChecked: false } : {}),
            },
          };
        }),

      setStatus: (newStatus) => set((state) => ({ status: { ...state.status, ...newStatus } })),

      tick: () =>
        set((state) => ({
          status: {
            ...state.status,
            remainingSeconds: Math.max(0, state.status.remainingSeconds - 1),
          },
        })),
    },
  }));
}
