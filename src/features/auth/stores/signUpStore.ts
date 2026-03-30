import { create } from 'zustand';
import { SignUpRequest } from '@/features/auth/types/authTypes';

interface SignUpState {
  inputs: SignUpRequest & { passCheck: string };

  status: {
    isEmailChecked: boolean;
    isCodeSent: boolean;
    isCodeVerified: boolean;
    isNicknameChecked: boolean;
    error: string | null;
    remainingSeconds: number;
    emailCode: string;
    dialogMessage: string | null;
    agreedTerms: boolean;
    agreedPrivacy: boolean;
    failCount: number;
  };

  actions: {
    setField: (field: keyof SignUpState['inputs'], value: string) => void;
    setStatus: (status: Partial<SignUpState['status']>) => void;
    tick: () => void;
    reset: () => void;
  };
}

const initialState = {
  inputs: {
    email: '',
    password: '',
    passCheck: '',
    nickname: '',
    departmentType: '',
  },
  status: {
    isEmailChecked: false,
    isCodeSent: false,
    isCodeVerified: false,
    isNicknameChecked: false,
    error: null,
    remainingSeconds: 0,
    emailCode: '',
    dialogMessage: null,
    agreedTerms: false,
    agreedPrivacy: false,
    failCount: 0,
  },
};

export const useSignUpStore = create<SignUpState>((set) => ({
  ...initialState,
  actions: {
    setField: (field, value) =>
      set((state) => {
        const isEmailField = field === 'email';
        const isLimitError = state.status.error === 'CODE_LIMIT_EXCEEDED';

        return {
          inputs: { ...state.inputs, [field]: value },
          status: {
            ...state.status,
            error: isEmailField ? null : isLimitError ? 'CODE_LIMIT_EXCEEDED' : null,

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

    reset: () => set(initialState),
  },
}));
