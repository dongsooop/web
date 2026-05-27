export type DeviceType = 'WEB' | 'ANDROID' | 'IOS';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SocialSignInRequest {
  token: string;
  deviceToken: string;
  deviceType: DeviceType;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
  departmentType: string;
}

export interface EmailValidateRequest {
  email: string;
}

export interface NicknameValidateRequest {
  nickname: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface SendCodeRequest {
  userEmail: string;
}

export interface VerifyCodeRequest {
  userEmail: string;
  code: string;
}
