import type { MyPagePreviewMode, MyPageSession, SocialAccount } from './types/ui-model';

const mockSocialAccounts: SocialAccount[] = [
  {
    platform: 'KAKAO',
    isConnected: true,
    connectedDate: '2026.04.09',
  },
  {
    platform: 'GOOGLE',
    isConnected: false,
  },
  {
    platform: 'APPLE',
    isConnected: false,
  },
];

export const mockLoggedOutSession: MyPageSession = {
  isLoggedIn: false,
  user: null,
  socialAccounts: mockSocialAccounts,
};

export const mockLoggedInSession: MyPageSession = {
  isLoggedIn: true,
  user: {
    id: 1,
    nickname: '동숲러',
    departmentType: 'DEPT_2001',
    role: ['USER'],
  },
  socialAccounts: mockSocialAccounts,
};

export const mockAdminSession: MyPageSession = {
  ...mockLoggedInSession,
  user: {
    ...mockLoggedInSession.user!,
    nickname: '동숲관리자',
    role: ['USER', 'ADMIN'],
  },
};

export function getMockMyPageSession(view?: string): {
  previewMode: MyPagePreviewMode;
  session: MyPageSession;
} {
  if (view === 'admin') {
    return {
      previewMode: 'admin',
      session: mockAdminSession,
    };
  }

  if (view === 'user') {
    return {
      previewMode: 'user',
      session: mockLoggedInSession,
    };
  }

  return {
    previewMode: 'guest',
    session: mockLoggedOutSession,
  };
}
