'use client';

import { formatReportDateTime } from '@/features/admin-report/labels';
import type { AdminReport } from '@/features/admin-report/types';

type ReportConversationProps = {
  report: AdminReport;
};

/**
 * 맥락 메시지는 신고된 메시지 직전 대화이고 오래된 순으로 온다.
 * 신고 대상이 보낸 말풍선을 구분해 표시하되, 대상 회원 ID 는 미처리 목록에만 있다.
 */
export default function ReportConversation({ report }: ReportConversationProps) {
  const context = report.messageContext ?? [];

  return (
    <div className="bg-gray1 flex flex-col gap-2 rounded-xl p-3">
      {context.length === 0 ? (
        <p className="text-caption text-gray5">앞선 대화가 없어요.</p>
      ) : (
        context.map((message, index) => {
          const isTarget =
            report.targetMemberId != null && message.senderId === report.targetMemberId;

          return (
            <div
              key={`${index}-${message.sentAt}`}
              className="border-gray2 flex flex-col gap-1 rounded-lg border bg-white px-3 py-2"
            >
              <div className="text-caption text-gray5 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-black">회원 {message.senderId}</span>
                {isTarget && <span className="text-warning font-semibold">신고 대상</span>}
                <span>{formatReportDateTime(message.sentAt)}</span>
              </div>
              <p className="text-caption break-words text-black">{message.content}</p>
            </div>
          );
        })
      )}

      <div className="border-warning bg-warning/10 flex flex-col gap-1 rounded-lg border px-3 py-2">
        <div className="text-caption text-warning-80 flex flex-wrap items-center gap-2 font-semibold">
          <span>신고된 메시지</span>
          <span>{formatReportDateTime(report.messageSentAt)}</span>
        </div>
        <p className="text-caption break-words text-black">
          {report.messageContent ?? '메시지 원문이 없어요.'}
        </p>
      </div>
    </div>
  );
}
