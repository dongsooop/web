import type { MyPagePreviewMode, MyPageSession } from './types/ui-model';

export const mockLoggedOutSession: MyPageSession = {
  isLoggedIn: false,
  user: null,
};

export const mockLoggedInSession: MyPageSession = {
  isLoggedIn: true,
  user: {
    id: 1,
    nickname: '동숲러',
    departmentType: 'DEPT_2001',
    role: ['USER'],
  },
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
