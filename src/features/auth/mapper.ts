import { BackendSignInResponse, BackendUser } from './types/backend';
import { SessionResponse, SignInResponse, UserResponse } from './types/response';
import { User } from './types/ui-model';

export function toUserResponse(user: BackendUser): UserResponse {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    departmentType: user.departmentType,
    role: user.role,
  };
}

export function toSignInResponse(data: BackendSignInResponse): SignInResponse {
  return {
    user: {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      departmentType: data.departmentType,
      role: data.role,
    },
  };
}

export function toSessionResponse(user: BackendUser | null): SessionResponse {
  return {
    isLoggedIn: !!user,
    user: user ? toUserResponse(user) : null,
  };
}

export function toUserModel(dto: UserResponse): User {
  return {
    id: dto.id,
    email: dto.email,
    nickname: dto.nickname,
    departmentType: dto.departmentType,
    roles: dto.role,
    isAdmin: dto.role.includes('ADMIN'),
  };
}