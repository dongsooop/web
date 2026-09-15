'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Link from 'next/link';

import Button from '@/components/ui/Button';
import CommonTag from '@/components/ui/CommonTag';
import LoginRequiredGuard from '@/components/ui/LoginRequiredGuard';
import PageHeader from '@/components/ui/PageHeader';
import { PRIVACY_URL, TERMS_URL } from '@/constants/policy';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  fetchEclassAssignments,
  fetchEclassLink,
  linkEclass,
  syncEclass,
  unlinkEclass,
} from '@/features/eclass/client/eclass.api';
import { issueEclassToken } from '@/features/eclass/client/eclass.token';
import type { EclassAssignment } from '@/features/eclass/types';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

const LINK_KEY = ['eclass-link'];
const DISCLAIMER = '참고용 정보예요. 마감·제출 여부는 이클래스에서 최종 확인해 주세요.';
const ASSIGNMENTS_KEY = ['eclass-assignments'];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '오류가 발생했어요.';
}

function formatDateTime(value: string | null) {
  return value ? value.replace('T', ' ').slice(0, 16) : '-';
}

function dDayLabel(dDay: number) {
  if (dDay === 0) return 'D-Day';
  return dDay > 0 ? `D-${dDay}` : `D+${-dDay}`;
}

function AssignmentRow({ assignment }: { assignment: EclassAssignment }) {
  return (
    <a
      href={assignment.link}
      target="_blank"
      rel="noopener noreferrer"
      className="border-gray2 flex flex-col gap-2 rounded-2xl border bg-white px-4 py-3 hover:underline"
    >
      <div className="flex flex-wrap gap-2">
        <CommonTag label={assignment.courseName} tone="blue" />
        <CommonTag
          label={dDayLabel(assignment.dDay)}
          tone={assignment.dDay <= 1 ? 'red' : 'gray'}
        />
        <CommonTag
          label={assignment.submitted ? '제출 완료' : '미제출'}
          tone={assignment.submitted ? 'gray' : 'yellow'}
        />
      </div>
      <p className="text-body font-semibold text-black">{assignment.title}</p>
      <p className="text-caption text-gray5">마감 {formatDateTime(assignment.dueAt)}</p>
    </a>
  );
}

function LinkNotice() {
  return (
    <p className="text-caption text-gray6 bg-gray1 rounded-xl p-3 leading-relaxed">
      동숲은 학교 공식 서비스가 아닌 재학생 프로젝트예요. 이클래스 비밀번호는 동숲 서버를 거치지
      않고, 이클래스가 발급한 접근 토큰만 암호화해 보관해요. 이 토큰으로는 과제 목록과 제출 여부만
      가져와요. 과제 정보는 하루 3회 갱신되는 참고용이라, 정확한 마감과 제출은 반드시 이클래스에서
      직접 확인해 주세요.
    </p>
  );
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-semibold hover:underline"
    >
      {label}
    </Link>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-1">
      <label className="flex cursor-pointer items-start">
        <div className="-ml-3 flex h-11 w-11 shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="accent-primary h-4 w-4 cursor-pointer"
          />
        </div>
        <span className="text-caption py-3 leading-relaxed text-black">
          이클래스 과제 정보 수집·이용에 동의하며, 과제 마감 확인의 책임이 본인에게 있음을
          이해했습니다. <PolicyLink href={PRIVACY_URL} label="개인정보 처리방침" />{' '}
          <PolicyLink href={TERMS_URL} label="이용약관" />
        </span>
      </label>
    </div>
  );
}

export default function EclassPage() {
  const queryClient = useQueryClient();
  const { isLoggedIn, isReady } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const showToast = useToastStore((state) => state.showToast);
  const showDialog = useDialogStore((state) => state.showDialog);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const enabled = isInitialized && isReady && isLoggedIn;
  const link = useQuery({ queryKey: LINK_KEY, queryFn: fetchEclassLink, enabled });
  const assignments = useQuery({
    queryKey: ASSIGNMENTS_KEY,
    queryFn: fetchEclassAssignments,
    enabled: enabled && link.data?.status === 'ACTIVE',
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: LINK_KEY });
    queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
  };

  const linkMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const token = await issueEclassToken(username, password);

      return linkEclass({ token });
    },
    onSuccess: () => {
      setPassword('');
      setAgreed(false);
      showToast('이클래스 연동이 완료됐어요.', 'success');
      invalidate();
    },
    onError: (error) => showToast(errorMessage(error), 'error'),
  });

  const syncMutation = useMutation({
    mutationFn: syncEclass,
    onSuccess: () => {
      showToast('과제를 다시 불러왔어요.', 'success');
      invalidate();
    },
    onError: (error) => showToast(errorMessage(error), 'error'),
  });

  const unlinkMutation = useMutation({
    mutationFn: unlinkEclass,
    onSuccess: () => {
      showToast('이클래스 연동을 해제했어요.', 'success');
      invalidate();
    },
    onError: (error) => showToast(errorMessage(error), 'error'),
  });

  const status = link.data?.status ?? null;
  const showForm = !link.data?.linked || status === 'EXPIRED';

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
      <PageHeader
        title="이클래스 과제"
        description="이클래스를 연동하면 마감이 다가오는 과제를 확인하고 알림을 받을 수 있어요."
      />

      <LoginRequiredGuard
        isLoggedIn={isLoggedIn}
        className="flex flex-col gap-3 rounded-2xl bg-white p-4"
      >
        {link.isLoading ? (
          <p className="text-body text-gray5">연동 상태를 확인하는 중...</p>
        ) : link.isError ? (
          <p className="text-body text-warning">{errorMessage(link.error)}</p>
        ) : (
          <>
            <div className="text-body text-black">
              상태:{' '}
              <span className="font-semibold">
                {!link.data?.linked ? '미연동' : status === 'ACTIVE' ? '연동됨' : '연동 만료'}
              </span>
              {link.data?.moodleFullname && ` · ${link.data.moodleFullname}`}
              {link.data?.linked && ` · 마지막 동기화 ${formatDateTime(link.data.lastSyncedAt)}`}
            </div>

            {status === 'EXPIRED' && (
              <p className="text-caption text-warning">
                이클래스 비밀번호가 바뀌었거나 토큰이 만료됐어요. 다시 연동해 주세요.
              </p>
            )}

            {showForm && (
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  linkMutation.mutate({ username, password });
                }}
              >
                <LinkNotice />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className="border-gray2 h-11 flex-1 rounded-lg border px-3"
                    placeholder="이클래스 아이디"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  <input
                    className="border-gray2 h-11 flex-1 rounded-lg border px-3"
                    placeholder="비밀번호 (저장되지 않아요)"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <ConsentCheckbox checked={agreed} onChange={setAgreed} />

                <Button
                  type="submit"
                  className="sm:w-fit"
                  disabled={!agreed}
                  isLoading={linkMutation.isPending}
                >
                  {status === 'EXPIRED' ? '다시 연동' : '연동하기'}
                </Button>
              </form>
            )}

            {link.data?.linked && (
              <div className="flex gap-2">
                {status === 'ACTIVE' && (
                  <Button
                    color="primary"
                    isLoading={syncMutation.isPending}
                    onClick={() => syncMutation.mutate()}
                  >
                    지금 동기화
                  </Button>
                )}
                <Button
                  color="danger"
                  isLoading={unlinkMutation.isPending}
                  onClick={() =>
                    showDialog({
                      title: '이클래스 연동 해제',
                      content: '저장된 과제 정보가 모두 삭제돼요.\n연동을 해제할까요?',
                      variant: 'danger',
                      onConfirm: () => unlinkMutation.mutate(),
                    })
                  }
                >
                  연동 해제
                </Button>
              </div>
            )}
          </>
        )}
      </LoginRequiredGuard>

      {status === 'ACTIVE' && (
        <section className="flex flex-col gap-3">
          <h2 className="text-heading font-semibold text-black">
            다가오는 과제 {assignments.data ? `(${assignments.data.assignments.length})` : ''}
          </h2>
          {assignments.isLoading ? (
            <p className="text-body text-gray5">과제를 불러오는 중...</p>
          ) : assignments.isError ? (
            <p className="text-body text-warning">{errorMessage(assignments.error)}</p>
          ) : assignments.data?.assignments.length ? (
            assignments.data.assignments.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <p className="text-body text-gray5">마감이 남은 과제가 없어요.</p>
          )}

          <p className="text-caption text-gray5">{DISCLAIMER}</p>
        </section>
      )}
    </div>
  );
}
