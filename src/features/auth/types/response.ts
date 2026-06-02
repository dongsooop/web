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

export interface SocialStateResponse {
  list: import('./backend').SocialState[];
}

export interface SocialLinkResponse {
  createdAt: string;
}
