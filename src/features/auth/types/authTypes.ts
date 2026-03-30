export type DeviceType = 'WEB' | 'ANDROID' | 'IOS';

export interface AuthUser {
  email: string;
  nickname?: string;
  department?: string | null;
  [key: string]: unknown;
}

export interface SignInRequest {
  email: string;
  password: string;
  fcmToken: string;
  deviceType: DeviceType;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
  departmentType: string;
}

export interface SignInResponse {
  user: AuthUser;
}

export interface SignUpResponse {
  message: string;
}

export interface SignOutResponse {
  ok: true;
}

export interface BackendSignInResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface BackendRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface EmailValidateRequest {
  email: string;
}

export interface NicknameValidateRequest {
  nickname: string;
}