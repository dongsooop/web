import type { MyPageSession } from './types/ui-model';

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

export function getMockMyPageSession(view?: string): {
  session: MyPageSession;
} {
  if (view === 'user') {
    return {
      session: mockLoggedInSession,
    };
  }

  return {
    session: mockLoggedOutSession,
  };
}
