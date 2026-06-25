'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CalendarDays, KeyRound, Link2, Table2, UserX } from 'lucide-react';
import type { User } from '@/features/auth/types/ui-model';

import Card from '@/components/ui/Card';
import { getDepartmentDisplayName } from '@/constants/department';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors/messages';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

import ManagementLinkCard from './ManagementLinkCard';
import { Divider } from '@/components/ui/Divider';

type LoggedInCardProps = {
  user: User;
};

export default function LoggedInCard({ user }: LoggedInCardProps) {
  const router = useRouter();
  const departmentLabel = getDepartmentDisplayName(user.departmentType);
  const { deleteAccount } = useAuth();
  const showDialog = useDialogStore((state) => state.showDialog);
  const showToast = useToastStore((state) => state.showToast);

  const handleDelete = async () => {
    try {
      await deleteAccount();
      showToast('회원 탈퇴가 완료되었어요.', 'success');
      router.replace('/');
    } catch (error) {
      showToast(getErrorMessage('auth', error, 'deleteAccount'), 'error');
    }
  };

  const handleOpenDialog = () => {
    showDialog({
      title: '동숲 회원 탈퇴',
      content: '탈퇴한 이메일로는 재가입 할 수 없어요.\n정말로 탈퇴하시겠어요?',
      cancel: '취소',
      confirm: '확인',
      color: 'danger',
      onConfirm: handleDelete,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 id="profile-title" className="sr-only">
          내 정보
        </h2>

        <div className="flex h-full items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
            <Image
              src="/img/profile.png"
              alt=""
              width={56}
              height={56}
              className="h-full w-full rounded-full object-cover"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-body sm:text-heading font-bold text-black">{user.nickname}</p>
            <p className="bg-primary-5 text-caption text-primary mt-2 inline-flex max-w-full items-center rounded-full px-3 py-1 font-bold">
              <span className="truncate">{departmentLabel}</span>
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 id="academic-management-title" className="text-body font-bold text-black">
          학사 관리
        </h2>

        <ul className="mt-3">
          <li>
            <ManagementLinkCard
              href="/timetable"
              icon={Table2}
              title="시간표 관리"
              description="수강 중인 과목과 시간표를 확인하고 관리할 수 있어요."
            />
          </li>
          <Divider />
          <li>
            <ManagementLinkCard
              href="/schedule"
              icon={CalendarDays}
              title="일정 관리"
              description="나의 일정을 추가하고 계획을 관리할 수 있어요."
            />
          </li>
        </ul>
      </Card>

      <Card>
        <h2 id="account-management-title" className="text-body font-bold text-black">
          계정 관리
        </h2>

        <ul className="mt-3">
          <li>
            <ManagementLinkCard
              href="/mypage/social"
              icon={Link2}
              title="소셜 계정 연동"
              description="원하는 소셜 계정을 연동하거나 해제할 수 있어요."
            />
          </li>
          <Divider />
          <li>
            <ManagementLinkCard
              href="/password-reset?from=mypage"
              icon={KeyRound}
              title="비밀번호 변경"
              description="새 비밀번호로 계정을 안전하게 관리할 수 있어요."
            />
          </li>
          <Divider />
          <li>
            <ManagementLinkCard
              icon={UserX}
              title="회원 탈퇴"
              description="서비스 이용을 중단하고 계정을 탈퇴할 수 있어요."
              onClick={handleOpenDialog}
            />
          </li>
        </ul>
      </Card>
    </div>
  );
}
