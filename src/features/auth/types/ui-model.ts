export interface User {
  id: number;
  email: string;
  nickname: string;
  departmentType: string;
  roles: string[];
  isAdmin: boolean;
}

export interface UserState {
  isLoggedIn: boolean;
  user: User | null;
}

export type LoginPlatform = 'kakao' | 'google';

export interface SocialConnectItem {
  platform: LoginPlatform;
  isConnected: boolean;
  date: string | null;
}
