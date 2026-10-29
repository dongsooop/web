'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import type { StoreApi } from 'zustand';
import { useStore } from 'zustand';
import { createSignUpStore, type SignUpStore } from '@/features/auth/stores/signUpStore';

const SignUpStoreContext = createContext<StoreApi<SignUpStore> | null>(null);

type SignUpProviderProps = {
  children: ReactNode;
};

export default function SignUpProvider({ children }: SignUpProviderProps) {
  const [store] = useState(createSignUpStore);

  return <SignUpStoreContext.Provider value={store}>{children}</SignUpStoreContext.Provider>;
}

export function useSignUpStore<T>(selector: (store: SignUpStore) => T) {
  const store = useContext(SignUpStoreContext);

  if (!store) {
    throw new Error('useSignUpStore must be used within SignUpProvider');
  }

  return useStore(store, selector);
}
