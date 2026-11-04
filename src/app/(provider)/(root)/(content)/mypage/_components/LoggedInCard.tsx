'use client';

import Image from 'next/image';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  GraduationCap,
  KeyRound,
  Link2,
  LogOut,
  Settings2,
  Table2,
  UserRound,
  UserX,
} from 'lucide-react';
import type { User } from '@/features/auth/types/ui-model';

import { getDepartmentDisplayName } from '@/constants/department';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

import ManagementLinkCard from './ManagementLinkCard';

type LoggedInCardProps = { loading: true; user?: never } | { loading?: false; user: User };

export default function LoggedInCard({ user, loading = false }: LoggedInCardProps) {
  const router = useRouter();
  const departmentLabel = user ? getDepartmentDisplayName(user.departmentType) : '';
  const { deleteAccount, logout, isLoggingOut } = useAuth();
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);

  const handleDelete = async () => {
    if (loading || !user) return;
    try {
      await deleteAccount();
      showToast('회원 탈퇴가 완료되었어요.', 'success');
      router.replace('/');
    } catch (error) {
      showToast(getErrorMessage('auth', error, 'deleteAccount'), 'error');
    }
  };

  const logoutAccount = async () => {
    if (loading || !user) return;
    try {
      await logout();
      router.refresh();
    } catch {
      showToast('로그아웃 중 오류가 발생했어요. 다시 시도해 주세요.', 'error');
    }
  };

  const handleOpenDialog = () => {
    if (loading || !user) return;
    showDialog({
      title: '동숲 회원 탈퇴',
      content:
        '탈퇴한 이메일로는 재가입 할 수 없어요.\n탈퇴하면 이클래스 연동 정보도 함께 삭제돼요.\n정말로 탈퇴하시겠어요?',
      cancel: '취소',
      confirm: '확인',
      color: 'danger',
      onConfirm: handleDelete,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="home-card" aria-labelledby="profile-title">
        <div className="home-card-head">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <UserRound className="h-5 w-5" />
            </span>
            <h2 id="profile-title">내 프로필</h2>
          </div>
        </div>

        <div className="border-surface-border mt-5 flex items-center gap-4 border-t pt-5">
          <div className="bg-surface-blue flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
            <Image
              src="/img/profile.png"
              alt=""
              width={64}
              height={64}
              className="h-full w-full rounded-full object-cover"
              aria-hidden="true"
            />
          </div>

          <div
            className="min-w-0 flex-1"
            aria-busy={loading}
            aria-label={loading ? '프로필 불러오는 중' : undefined}
          >
            <div className="text-heading font-bold text-black">
              {loading ? <SkeletonText className="h-7 w-24" /> : user?.nickname}
            </div>
            <div className="bg-surface-blue text-caption mt-2 inline-flex max-w-full items-center rounded-md px-2.5 py-1 font-semibold text-sky-700">
              <div className="truncate">
                {loading ? <SkeletonText className="w-32" /> : departmentLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="home-card" aria-labelledby="academic-management-title">
          <div className="home-card-head">
            <div className="flex items-center gap-2">
              <span
                className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
                aria-hidden="true"
              >
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 id="academic-management-title">학사 관리</h2>
            </div>
          </div>

          <ul className="border-surface-border mt-5 border-t">
            <li className="border-surface-border border-b last:border-b-0">
              <ManagementLinkCard
                disabled={loading}
                href="/timetable"
                icon={Table2}
                title="시간표 관리"
                description="수강 중인 과목과 시간표를 확인하고 관리할 수 있어요."
              />
            </li>
            <li className="border-surface-border border-b last:border-b-0">
              <ManagementLinkCard
                disabled={loading}
                href="/schedule"
                icon={CalendarDays}
                title="일정 관리"
                description="나의 일정을 추가하고 계획을 관리할 수 있어요."
              />
            </li>
          </ul>
        </section>

        <section className="home-card" aria-labelledby="account-management-title">
          <div className="home-card-head">
            <div className="flex items-center gap-2">
              <span
                className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
                aria-hidden="true"
              >
                <Settings2 className="h-5 w-5" />
              </span>
              <h2 id="account-management-title">계정 관리</h2>
            </div>
          </div>

          <ul className="border-surface-border mt-5 border-t">
            <li className="border-surface-border border-b last:border-b-0">
              <ManagementLinkCard
                disabled={loading}
                href="/mypage/social"
                icon={Link2}
                title="소셜 계정 연동"
                description="원하는 소셜 계정을 연동하거나 해제할 수 있어요."
              />
            </li>
            <li className="border-surface-border border-b last:border-b-0">
              <ManagementLinkCard
                disabled={loading}
                href="/password-reset?from=mypage"
                icon={KeyRound}
                title="비밀번호 변경"
                description="새 비밀번호로 계정을 안전하게 관리할 수 있어요."
              />
            </li>
            <li className="border-surface-border hidden border-b max-[700px]:block">
              <ManagementLinkCard
                icon={LogOut}
                title={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                description="현재 계정에서 로그아웃해요."
                onClick={logoutAccount}
                disabled={loading || isLoggingOut}
              />
            </li>
            <li className="border-surface-border border-b last:border-b-0">
              <ManagementLinkCard
                disabled={loading}
                icon={UserX}
                title="회원 탈퇴"
                description="서비스 이용을 중단하고 계정을 탈퇴할 수 있어요."
                onClick={handleOpenDialog}
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
