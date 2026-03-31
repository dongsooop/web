// Next 서버 내부 전용

export interface BackendUser {
  id: number;
  email: string;
  nickname: string;
  departmentType: string;
  role: string[];
}

export interface BackendSignInResponse {
  accessToken: string;
  refreshToken: string;
  user: BackendUser;
}

export interface BackendRefreshResponse {
  accessToken: string;
  refreshToken: string;
}