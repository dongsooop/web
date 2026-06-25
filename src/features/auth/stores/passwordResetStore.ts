import { createStore } from 'zustand/vanilla';

export type PasswordResetFormStep = 'email' | 'password';

export type PasswordResetInputs = {
  email: string;
  code: string;
  pwd: string;
  pwdCheck: string;
};

export type PasswordResetStatus = {
  isEmailChecked: boolean;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  remainingSeconds: number;
  failCount: number;
  error: unknown | null;
  errorContext: string | null;
};

type PasswordResetActions = {
  setField: (key: keyof PasswordResetInputs, value: string) => void;
  setStatus: (patch: Partial<PasswordResetStatus>) => void;
  tick: () => void;
  setStep: (step: PasswordResetFormStep) => void;
  reset: () => void;
};

export type PasswordResetStore = {
  step: PasswordResetFormStep;
  inputs: PasswordResetInputs;
  status: PasswordResetStatus;
  actions: PasswordResetActions;
};

const initialInputs: PasswordResetInputs = {
  email: '',
  code: '',
  pwd: '',
  pwdCheck: '',
};

const initialStatus: PasswordResetStatus = {
  isEmailChecked: false,
  isCodeSent: false,
  isCodeVerified: false,
  remainingSeconds: 0,
  failCount: 0,
  error: null,
  errorContext: null,
};

export const initialPasswordResetState = {
  step: 'email' as const,
  inputs: initialInputs,
  status: initialStatus,
};

export function createPasswordResetStore() {
  return createStore<PasswordResetStore>()((set) => ({
    ...initialPasswordResetState,
    actions: {
      setField: (key, value) =>
        set((state) => {
          const isEmailField = key === 'email';

          const isCodeLimitError =
            typeof state.status.error === 'string' && state.status.error === 'CODE_LIMIT_EXCEEDED';
          const keepCodeLimitError = isCodeLimitError && !isEmailField;

          return {
            step: isEmailField ? 'email' : state.step,
            inputs: {
              ...state.inputs,
              [key]: value,
              ...(isEmailField
                ? {
                    code: '',
                    pwd: '',
                    pwdCheck: '',
                  }
                : {}),
            },
            status: {
              ...state.status,
              error: keepCodeLimitError ? state.status.error : null,
              errorContext: keepCodeLimitError ? state.status.errorContext : null,
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
        set((state) => ({
          status: { ...state.status, ...patch },
        })),

      tick: () =>
        set((state) => ({
          status: {
            ...state.status,
            remainingSeconds: Math.max(0, state.status.remainingSeconds - 1),
          },
        })),

      setStep: (step) => set({ step }),

      reset: () => set(initialPasswordResetState),
    },
  }));
}
