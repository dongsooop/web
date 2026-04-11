import { create } from 'zustand';

import type { User } from '../types/ui-model';

type AuthStore = {
  user: User | null;
  isReady: boolean;
  isExpired: boolean;

  // 로그인 사용자 정보 저장
  setUser: (user: User) => void;

  // 인증 상태 초기화
  clearAuth: () => void;

  // 초기 세션 확인 완료 표시
  setReady: () => void;

  // 세션 만료 상태로 전환
  expireSession: () => void;

  // 세션 만료 상태 해제
  clearExpired: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isReady: false,
  isExpired: false,

  // 로그인 성공 또는 세션 복원 시 사용자 정보 반영
  setUser: (user) =>
    set({
      user,
      isExpired: false,
      isReady: true,
    }),

  // 로그아웃 또는 인증 해제 시 상태 초기화
  clearAuth: () =>
    set({
      user: null,
      isExpired: false,
    }),

  // 초기 인증 확인이 끝났음을 표시
  setReady: () =>
    set({
      isReady: true,
    }),

  // 세션 만료 상태를 반영하고 사용자 정보 제거
  expireSession: () =>
    set({
      user: null,
      isExpired: true,
      isReady: true,
    }),

  // 세션 만료 플래그만 해제
  clearExpired: () =>
    set({
      isExpired: false,
    }),
}));
