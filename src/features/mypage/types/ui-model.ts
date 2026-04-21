export type SocialPlatform = 'KAKAO' | 'GOOGLE' | 'APPLE';
export type MyPagePreviewMode = 'guest' | 'user' | 'admin';

export type MyPageMenuAction =
  | 'setting'
  | 'login'
  | 'calendar'
  | 'timetable'
  | 'admin-report'
  | 'admin-blind-date'
  | 'admin-feedback'
  | 'user-feedback';

export type MyPageUser = {
  id: number;
  nickname: string;
  departmentType: string;
  role: string[];
};

export type SocialAccount = {
  platform: SocialPlatform;
  isConnected: boolean;
  connectedDate?: string;
};

export type MyPageSession = {
  isLoggedIn: boolean;
  user: MyPageUser | null;
  socialAccounts: SocialAccount[];
};
