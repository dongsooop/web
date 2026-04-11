// Next 서버 내부 전용

export interface BackendUser {
  id: number;
  email: string;
  nickname: string;
  departmentType: string;
  role: string[];
}

export interface BackendSignInResponse {
  id: number;
  email: string;
  nickname: string;
  departmentType: string;
  role: string[];
  accessToken: string;
  refreshToken: string;
}

export interface BackendReissueResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtAccessPayload {
  sub: string;
  role: string[];
  type: 'ACCESS';
  iat: number;
  exp: number;
  did?: number;
}
