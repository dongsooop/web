'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, CheckCircle2, Clock3, Link2, RefreshCw } from 'lucide-react';

import Button from '@/components/ui/Button';
import CommonTag from '@/components/ui/CommonTag';
import { Skeleton } from '@/components/ui/Skeleton';
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
    <li className="border-surface-border border-b last:border-b-0">
      <a
        href={assignment.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-surface-soft focus-visible:ring-primary group flex min-h-28 items-center gap-4 rounded-lg px-1 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3"
        aria-label={`${assignment.title}, ${assignment.courseName}, ${dDayLabel(assignment.dDay)}, ${assignment.submitted ? '제출 완료' : '미제출'}, 마감 ${formatDateTime(assignment.dueAt)}, 새 창에서 열기`}
      >
        <span
          className="bg-surface-blue hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sky-700 sm:flex"
          aria-hidden="true"
        >
          <BookOpen className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-2 flex flex-wrap gap-1.5">
            <CommonTag label={assignment.courseName} tone="blue" />
            <CommonTag
              label={dDayLabel(assignment.dDay)}
              tone={assignment.dDay <= 1 ? 'red' : 'gray'}
            />
            <CommonTag
              label={assignment.submitted ? '제출 완료' : '미제출'}
              tone={assignment.submitted ? 'gray' : 'yellow'}
            />
          </span>
          <strong className="text-bodySm group-hover:text-primary sm:text-body block font-semibold text-black transition-colors">
            {assignment.title}
          </strong>
          <span className="text-caption text-surface-muted mt-1.5 flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            마감 {formatDateTime(assignment.dueAt)}
          </span>
        </span>
        <ArrowUpRight
          className="text-surface-muted group-hover:text-primary h-4 w-4 shrink-0 transition-colors"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

function LinkNotice() {
  return (
    <p className="bg-surface-soft text-caption text-surface-muted rounded-xl p-4 leading-relaxed">
      동숲은 학교 공식 서비스가 아닌 재학생 프로젝트예요. 이클래스 비밀번호는 동숲 서버를 거치지
      않고, 이클래스가 발급한 접근 토큰만 암호화해 보관해요. 동숲은 이클래스 계정 이름과 과제
      목록·제출 여부를 받아 화면에 보여줘요. 과제 정보는 하루 3회 갱신되는 참고용이라, 정확한 마감과
      제출은 반드시 이클래스에서 직접 확인해 주세요.
    </p>
  );
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary inline-flex min-h-11 items-center font-semibold hover:underline"
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
    <div className="home-dashboard">
      <header className="home-intro">
        <div>
          <p className="home-date">ECLASS ASSIGNMENTS</p>
          <h1>
            과제 마감, 놓치지 않게. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">이클래스 과제와 제출 상태를 한곳에서 확인해요.</p>
        </div>
        <span className="home-semester">이클래스 연동</span>
      </header>

      <section className="home-card" aria-labelledby="eclass-link-title">
        <div className="home-card-head">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <Link2 className="h-5 w-5" />
            </span>
            <h2 id="eclass-link-title">이클래스 연결</h2>
          </div>
          {isLoggedIn && link.data ? (
            <span
              className={`text-caption rounded-md px-2.5 py-1 font-semibold ${status === 'ACTIVE' ? 'bg-surface-blue text-sky-700' : status === 'EXPIRED' ? 'bg-warning/10 text-warning-80' : 'bg-surface-soft text-surface-muted'}`}
            >
              {status === 'ACTIVE' ? '연결됨' : status === 'EXPIRED' ? '연결 만료' : '연결 전'}
            </span>
          ) : null}
        </div>

        {!isReady || !isInitialized || link.isLoading ? (
          <div className="mt-6 space-y-3" aria-label="연동 상태를 확인하는 중" aria-busy="true">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : !isLoggedIn ? (
          <div className="home-empty bg-surface-soft mt-5 flex-col gap-3 rounded-xl px-4 py-6">
            <p>로그인하면 이클래스를 연결하고 과제를 확인할 수 있어요.</p>
            <Link
              href="/sign-in"
              className="focus-visible:ring-primary min-h-11 gap-1 rounded-lg px-3 focus-visible:ring-2 focus-visible:outline-none"
            >
              로그인하기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : link.isError ? (
          <p className="text-bodySm text-warning mt-5" role="alert">
            {errorMessage(link.error)}
          </p>
        ) : (
          <div className="mt-5 flex max-w-4xl flex-col gap-5">
            <div className="border-surface-border flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-4">
              <span className="text-bodySm font-semibold text-black">
                {!link.data?.linked
                  ? '아직 연결되지 않았어요.'
                  : link.data.moodleFullname || '이클래스 계정'}
              </span>
              {link.data?.linked && (
                <span className="text-caption text-surface-muted">
                  마지막 동기화 {formatDateTime(link.data.lastSyncedAt)}
                </span>
              )}
            </div>

            {status === 'EXPIRED' && (
              <p className="text-caption text-warning bg-warning/10 rounded-lg p-3" role="alert">
                이클래스 비밀번호가 바뀌었거나 토큰이 만료됐어요. 다시 연동해 주세요.
              </p>
            )}

            {showForm && (
              <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  linkMutation.mutate({ username, password });
                }}
              >
                <LinkNotice />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-bodySm flex flex-col gap-2 font-semibold text-black">
                    이클래스 아이디
                    <input
                      className="border-surface-border focus:border-primary focus:ring-primary h-11 w-full rounded-lg border px-3 font-normal outline-none focus:ring-1"
                      placeholder="아이디 입력"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </label>
                  <label className="text-bodySm flex flex-col gap-2 font-semibold text-black">
                    비밀번호
                    <input
                      className="border-surface-border focus:border-primary focus:ring-primary h-11 w-full rounded-lg border px-3 font-normal outline-none focus:ring-1"
                      placeholder="비밀번호 입력 · 저장되지 않아요"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>
                </div>

                <ConsentCheckbox checked={agreed} onChange={setAgreed} />

                <Button
                  type="submit"
                  className="rounded-lg sm:w-fit"
                  disabled={!agreed}
                  isLoading={linkMutation.isPending}
                >
                  {status === 'EXPIRED' ? '다시 연동' : '연동하기'}
                </Button>
              </form>
            )}

            {link.data?.linked && (
              <div className="flex flex-wrap gap-2">
                {status === 'ACTIVE' && (
                  <Button
                    className="rounded-lg"
                    isLoading={syncMutation.isPending}
                    onClick={() => syncMutation.mutate()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" /> 지금 동기화
                  </Button>
                )}
                <Button
                  color="danger"
                  className="rounded-lg"
                  isLoading={unlinkMutation.isPending}
                  onClick={() =>
                    showDialog({
                      title: '이클래스 연동 해제',
                      content: '저장된 과제 정보가 모두 삭제돼요.\n연동을 해제할까요?',
                      color: 'danger',
                      onConfirm: () => unlinkMutation.mutate(),
                    })
                  }
                >
                  연동 해제
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {isLoggedIn && status === 'ACTIVE' && (
        <section className="home-card" aria-labelledby="eclass-assignments-title">
          <div className="home-card-head">
            <div className="flex items-center gap-2">
              <span
                className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
                aria-hidden="true"
              >
                <BookOpen className="h-5 w-5" />
              </span>
              <h2 id="eclass-assignments-title">다가오는 과제</h2>
            </div>
            {assignments.data ? (
              <span className="text-caption text-surface-muted font-semibold">
                {assignments.data.assignments.length}개
              </span>
            ) : null}
          </div>

          <div className="mt-5">
            {assignments.isLoading ? (
              <div className="space-y-5" aria-label="과제를 불러오는 중" aria-busy="true">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="border-surface-border flex gap-4 border-b pb-5">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-28 rounded" />
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <Skeleton className="h-4 w-40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : assignments.isError ? (
              <p className="home-empty min-h-32" role="alert">
                {errorMessage(assignments.error)}
              </p>
            ) : assignments.data?.assignments.length ? (
              <ul>
                {assignments.data.assignments.map((assignment) => (
                  <AssignmentRow key={assignment.id} assignment={assignment} />
                ))}
              </ul>
            ) : (
              <div className="home-empty min-h-36 flex-col gap-2">
                <CheckCircle2 className="h-7 w-7 text-sky-700" aria-hidden="true" />
                <p>마감이 남은 과제가 없어요.</p>
              </div>
            )}
          </div>
          <p className="home-card-note border-surface-border border-t pt-4">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {DISCLAIMER}
          </p>
        </section>
      )}
    </div>
  );
}
