// 브라우저가 받는 응답 타입

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  departmentType: string;
  role: string[];
}

export interface SignInResponse {
  user: UserResponse;
}

export interface SessionResponse {
  isLoggedIn: boolean;
  user: UserResponse | null;
}