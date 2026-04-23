export type MyPageUser = {
  id: number;
  nickname: string;
  departmentType: string;
  role: string[];
};

export type MyPageSession = {
  isLoggedIn: boolean;
  user: MyPageUser | null;
};
