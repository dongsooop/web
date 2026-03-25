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