'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import CommonTag from '@/components/ui/CommonTag';
import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { createSanction, dismissReport } from '@/features/admin-report/client/adminReport.api';
import {
  ADMIN_REPORT_QUERY_KEY,
  useAdminReportQuery,
} from '@/features/admin-report/hooks/useAdminReportQuery';
import {
  formatReportDateTime,
  REPORT_REASON_LABEL,
  REPORT_TYPE_LABEL,
  SANCTION_TYPE_LABEL,
} from '@/features/admin-report/labels';
import type { AdminReport, ReportFilter, SanctionRequest } from '@/features/admin-report/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

import ReportDetailModal from './ReportDetailModal';

const TABS: { id: ReportFilter; label: string }[] = [
  { id: 'UNPROCESSED', label: '미처리' },
  { id: 'PROCESSED', label: '처리 완료' },
  { id: 'ACTIVE_SANCTIONS', label: '활성 제재' },
  { id: 'ALL', label: '전체' },
];

const CONFLICT_MESSAGE = '다른 관리자가 이미 처리했습니다. 목록을 새로고침할게요.';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '처리 중 오류가 발생했어요.';
}

function ReportRow({ report, onSelect }: { report: AdminReport; onSelect: () => void }) {
  const preview = report.messageContent?.trim();

  return (
    <button
      type="button"
      onClick={onSelect}
      className="border-gray2 hover:border-primary/30 flex w-full cursor-pointer flex-col gap-2 rounded-2xl border bg-white px-4 py-3 text-left"
    >
      <div className="flex flex-wrap items-center gap-2">
        <CommonTag label={REPORT_TYPE_LABEL[report.reportType]} tone="blue" />
        <CommonTag label={REPORT_REASON_LABEL[report.reportReason]} tone="yellow" />
        {report.isProcessed ? (
          <CommonTag
            label={report.sanctionType ? SANCTION_TYPE_LABEL[report.sanctionType] : '기각'}
            tone="gray"
          />
        ) : (
          <CommonTag label="미처리" tone="red" />
        )}
        {report.isSanctionActive ? <CommonTag label="제재 중" tone="red" /> : null}
      </div>

      {preview ? <p className="text-body line-clamp-2 text-black">{preview}</p> : null}

      <div className="text-caption text-gray5 flex flex-wrap gap-x-3 gap-y-1">
        <span>{formatReportDateTime(report.createdAt)}</span>
        <span>신고자 {report.reporterNickname}</span>
        <span>
          대상 {report.targetMemberNickname ?? `회원 ${report.targetMemberId ?? report.targetId}`}
        </span>
      </div>
    </button>
  );
}

export default function AdminReportBoard() {
  const queryClient = useQueryClient();
  const { isReady, isLoggedIn, user } = useAuth();
  const showToast = useToastStore((state) => state.showToast);
  const showDialog = useDialogStore((state) => state.showDialog);
  const [filter, setFilter] = useState<ReportFilter>('UNPROCESSED');
  const [selected, setSelected] = useState<AdminReport | null>(null);

  const { items, hasMore, isInitialLoading, isError, error, isFetchingNextPage, fetchNextPage } =
    useAdminReportQuery(filter);

  const refresh = () => {
    setSelected(null);
    queryClient.invalidateQueries({ queryKey: ADMIN_REPORT_QUERY_KEY });
  };

  const handleError = (requestError: unknown) => {
    if (requestError instanceof ApiError && requestError.status === HttpStatusCode.CONFLICT) {
      showToast(CONFLICT_MESSAGE, 'error');
      refresh();
      return;
    }

    showToast(errorMessage(requestError), 'error');
  };

  const sanctionMutation = useMutation({
    mutationFn: createSanction,
    onSuccess: () => {
      showToast('제재를 적용했어요.', 'success');
      refresh();
    },
    onError: handleError,
  });

  const dismissMutation = useMutation({
    mutationFn: dismissReport,
    onSuccess: () => {
      showToast('신고를 기각했어요.', 'success');
      refresh();
    },
    onError: handleError,
  });

  const isPending = sanctionMutation.isPending || dismissMutation.isPending;

  const handleSanction = (payload: SanctionRequest) => {
    const label = SANCTION_TYPE_LABEL[payload.sanctionType];
    const target = selected?.targetMemberNickname ?? `회원 ${payload.targetMemberId}`;

    showDialog({
      title: '제재 적용',
      content: `${target}에게 ${label} 처분을 적용할까요?\n적용하면 되돌릴 수 없어요.`,
      variant: 'danger',
      onConfirm: () => sanctionMutation.mutate(payload),
    });
  };

  const handleDismiss = (report: AdminReport) => {
    showDialog({
      title: '신고 기각',
      content: '제재 없이 이 신고를 닫을까요?',
      onConfirm: () => dismissMutation.mutate(report.id),
    });
  };

  if (!isReady) {
    return (
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!isLoggedIn || !user?.isAdmin) {
    return (
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-4 py-16 text-center">
        <p className="text-body text-gray6">
          {isLoggedIn ? '관리자만 접근할 수 있습니다.' : '관리자 로그인이 필요해요.'}
        </p>
        {!isLoggedIn ? (
          <Link
            href="/sign-in"
            className="bg-primary text-body inline-flex min-h-11 items-center rounded-lg px-4 font-semibold text-white"
          >
            로그인하기
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
      <PageHeader title="신고 관리" description="접수된 신고를 확인하고 제재하거나 기각해요." />

      <div className="flex flex-wrap gap-4">
        {TABS.map((tab) => {
          const active = tab.id === filter;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id);
                setSelected(null);
              }}
              className={`text-bodySm relative inline-flex h-11 cursor-pointer items-center px-2 pb-2 font-semibold transition ${
                active ? 'text-primary' : 'text-gray6 hover:text-black'
              }`}
            >
              <span
                className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full ${
                  active ? 'bg-primary' : 'bg-transparent'
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {isError ? (
        <p className="text-body text-warning py-8 text-center">{errorMessage(error)}</p>
      ) : isInitialLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-body text-gray5 py-8 text-center">해당하는 신고가 없어요.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((report) => (
            <ReportRow key={report.id} report={report} onSelect={() => setSelected(report)} />
          ))}
        </div>
      )}

      {hasMore ? (
        <Button
          variant="outline"
          className="sm:w-fit sm:self-center"
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          다음 페이지
        </Button>
      ) : null}

      {selected ? (
        <ReportDetailModal
          report={selected}
          isPending={isPending}
          onCloseAction={() => setSelected(null)}
          onSanctionAction={handleSanction}
          onDismissAction={handleDismiss}
        />
      ) : null}
    </div>
  );
}
