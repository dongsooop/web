'use client';

import { createContext, useContext } from 'react';

import type {
  MyPageMenuAction,
  MyPagePreviewMode,
  MyPageSession,
  SocialPlatform,
} from '../types/ui-model';

type MyPageContextValue = {
  previewMode: MyPagePreviewMode;
  session: MyPageSession;
  selectMenu: (action: MyPageMenuAction) => void;
  selectSocialAccount: (platform: SocialPlatform) => void;
};

const MyPageContext = createContext<MyPageContextValue | null>(null);

type MyPageProviderProps = {
  value: MyPageContextValue;
  children: React.ReactNode;
};

export function MyPageProvider({ value, children }: MyPageProviderProps) {
  return <MyPageContext.Provider value={value}>{children}</MyPageContext.Provider>;
}

export function useMyPageContext() {
  const context = useContext(MyPageContext);

  if (!context) {
    throw new Error('useMyPageContext must be used within MyPageProvider');
  }

  return context;
}
