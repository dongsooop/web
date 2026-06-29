'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import type { StoreApi } from 'zustand';
import { useStore } from 'zustand';
import {
  createPasswordResetStore,
  type PasswordResetStore,
} from '@/features/auth/stores/passwordResetStore';

const PasswordResetStoreContext = createContext<StoreApi<PasswordResetStore> | null>(null);

type PasswordResetProviderProps = {
  children: ReactNode;
};

export default function PasswordResetProvider({ children }: PasswordResetProviderProps) {
  const storeRef = useRef<StoreApi<PasswordResetStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createPasswordResetStore();
  }

  return (
    <PasswordResetStoreContext.Provider value={storeRef.current}>
      {children}
    </PasswordResetStoreContext.Provider>
  );
}

export function usePasswordResetStore<T>(selector: (store: PasswordResetStore) => T) {
  const store = useContext(PasswordResetStoreContext);

  if (!store) {
    throw new Error('usePasswordResetStore must be used within PasswordResetProvider');
  }

  return useStore(store, selector);
}
