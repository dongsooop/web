// 브라우저나 next에서 보내는 요청 타입

export type DeviceType = 'WEB' | 'ANDROID' | 'IOS';

// 로그인
export interface SignInRequest {
  email: string;
  password: string;
  fcmToken: string;
  deviceType: DeviceType;
}

// 회원가입
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

export interface ResetPasswordRequest  {
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