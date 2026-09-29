'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import CommonTag from '@/components/ui/CommonTag';
import {
  formatReportDateTime,
  isBoardReport,
  isMessageReport,
  REPORT_REASON_LABEL,
  REPORT_TYPE_LABEL,
  SANCTION_TYPE_LABEL,
} from '@/features/admin-report/labels';
import type { AdminReport, SanctionRequest } from '@/features/admin-report/types';
import { lockBody, unlockBody } from '@/lib/body-lock';

import ReportConversation from './ReportConversation';
import SanctionForm from './SanctionForm';

type ReportDetailModalProps = {
  report: AdminReport;
  isPending: boolean;
  onCloseAction: () => void;
  onSanctionAction: (payload: SanctionRequest) => void;
  onDismissAction: (report: AdminReport) => void;
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_1fr] gap-2 py-1">
      <span className="text-caption text-gray5">{label}</span>
      <span className="text-caption break-words text-black">{children}</span>
    </div>
  );
}

export default function ReportDetailModal({
  report,
  isPending,
  onCloseAction,
  onSanctionAction,
  onDismissAction,
}: ReportDetailModalProps) {
  useEffect(() => {
    lockBody();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockBody();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseAction]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCloseAction}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-gray2 flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-heading font-bold text-black">신고 {report.id}</h2>
          <button
            type="button"
            onClick={onCloseAction}
            aria-label="닫기"
            className="hover:bg-gray1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
          >
            <X className="text-gray5 h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <CommonTag label={REPORT_TYPE_LABEL[report.reportType]} tone="blue" />
            <CommonTag label={REPORT_REASON_LABEL[report.reportReason]} tone="yellow" />
            <CommonTag
              label={report.isProcessed ? '처리 완료' : '미처리'}
              tone={report.isProcessed ? 'gray' : 'red'}
            />
          </div>

          <div className="flex flex-col">
            <DetailRow label="신고 시각">{formatReportDateTime(report.createdAt)}</DetailRow>
            <DetailRow label="신고자">{report.reporterNickname}</DetailRow>
            <DetailRow label="대상">
              {report.targetMemberNickname ?? `회원 ${report.targetMemberId ?? report.targetId}`}
            </DetailRow>
            <DetailRow label="신고자 설명">{report.description || '없음'}</DetailRow>
            {isBoardReport(report.reportType) && report.targetUrl ? (
              <DetailRow label="대상 게시글">
                <Link
                  href={report.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  게시글 열기
                </Link>
              </DetailRow>
            ) : null}
          </div>

          {isMessageReport(report.reportType) ? <ReportConversation report={report} /> : null}

          {report.isProcessed ? (
            <div className="border-gray2 flex flex-col rounded-xl border p-4">
              <DetailRow label="처리한 관리자">{report.adminNickname ?? '-'}</DetailRow>
              <DetailRow label="제재">
                {report.sanctionType ? SANCTION_TYPE_LABEL[report.sanctionType] : '기각'}
              </DetailRow>
              <DetailRow label="제재 사유">{report.sanctionReason || '-'}</DetailRow>
              <DetailRow label="제재 기간">
                {report.sanctionStartDate
                  ? `${formatReportDateTime(report.sanctionStartDate)} ~ ${formatReportDateTime(report.sanctionEndDate)}`
                  : '-'}
              </DetailRow>
            </div>
          ) : (
            <>
              <SanctionForm
                report={report}
                isPending={isPending}
                onSubmitAction={onSanctionAction}
              />

              <button
                type="button"
                onClick={() => onDismissAction(report)}
                disabled={isPending}
                className="border-gray2 text-body text-gray6 min-h-11 cursor-pointer rounded-lg border bg-white font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                제재 없이 기각
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
