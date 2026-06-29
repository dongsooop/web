'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import type { StoreApi } from 'zustand';
import { useStore } from 'zustand';
import { createSignUpStore, type SignUpStore } from '@/features/auth/stores/signUpStore';

const SignUpStoreContext = createContext<StoreApi<SignUpStore> | null>(null);

type SignUpProviderProps = {
  children: ReactNode;
};

export default function SignUpProvider({ children }: SignUpProviderProps) {
  const storeRef = useRef<StoreApi<SignUpStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createSignUpStore();
  }

  return (
    <SignUpStoreContext.Provider value={storeRef.current}>{children}</SignUpStoreContext.Provider>
  );
}

export function useSignUpStore<T>(selector: (store: SignUpStore) => T) {
  const store = useContext(SignUpStoreContext);

  if (!store) {
    throw new Error('useSignUpStore must be used within SignUpProvider');
  }

  return useStore(store, selector);
}
