import { create } from 'zustand';

interface PasswordResetState {
  step: 'email' | 'password';
  inputs: {
    email: string;
    code: string;
    pass: string;
    passCheck: string;
  };
  status: {
    isEmailChecked: boolean;
    isCodeSent: boolean;
    isCodeVerified: boolean;
    remainingSeconds: number;
    failCount: number;
    error: unknown | null;
    errorContext: string | null;
  };
  actions: {
    setField: (key: keyof PasswordResetState['inputs'], value: string) => void;
    setStatus: (patch: Partial<PasswordResetState['status']>) => void;
    tick: () => void;
    setStep: (step: 'email' | 'password') => void;
    reset: () => void;
  };
}

const initialState = {
  step: 'email' as const,
  inputs: { email: '', code: '', pass: '', passCheck: '' },
  status: {
    isEmailChecked: false,
    isCodeSent: false,
    isCodeVerified: false,
    remainingSeconds: 0,
    failCount: 0,
    error: null,
    errorContext: null,
  },
};

export const usePasswordResetStore = create<PasswordResetState>((set) => ({
  ...initialState,
  actions: {
    setField: (key, value) =>
      set((s) => {
        const isEmailField = key === 'email';
        const isLimitError = s.status.error === 'CODE_LIMIT_EXCEEDED';

        return {
          step: isEmailField ? 'email' : s.step,
          inputs: {
            ...s.inputs,
            [key]: value,
            ...(isEmailField
              ? {
                  code: '',
                  pass: '',
                  passCheck: '',
                }
              : {}),
          },
          status: {
            ...s.status,
            error: isEmailField ? null : isLimitError ? s.status.error : null,
            errorContext: isEmailField ? null : isLimitError ? s.status.errorContext : null,
            ...(isEmailField
              ? {
                  isEmailChecked: false,
                  isCodeSent: false,
                  isCodeVerified: false,
                  remainingSeconds: 0,
                  failCount: 0,
                }
              : {}),
          },
        };
      }),

    setStatus: (patch) =>
      set((s) => ({
        status: { ...s.status, ...patch },
      })),

    tick: () =>
      set((s) => ({
        status: { ...s.status, remainingSeconds: Math.max(0, s.status.remainingSeconds - 1) },
      })),

    setStep: (step) => set({ step }),

    reset: () => set(initialState),
  },
}));
