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
