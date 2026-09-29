export type ReportFilter = 'ALL' | 'UNPROCESSED' | 'PROCESSED' | 'ACTIVE_SANCTIONS';

export type ReportType =
  | 'PROJECT_BOARD'
  | 'STUDY_BOARD'
  | 'MARKETPLACE_BOARD'
  | 'TUTORING_BOARD'
  | 'MEMBER'
  | 'CHAT_MESSAGE'
  | 'BLINDDATE_MESSAGE';

export type ReportReason =
  | 'SPAM'
  | 'INAPPROPRIATE_CONTENT'
  | 'HATE_SPEECH'
  | 'FRAUD'
  | 'PRIVACY_VIOLATION'
  | 'COPYRIGHT_INFRINGEMENT'
  | 'OTHER';

export type SanctionType =
  | 'WARNING'
  | 'TEMPORARY_BAN'
  | 'PERMANENT_BAN'
  | 'CONTENT_DELETION'
  | 'CHAT_KICK';

export type ReportMessageContext = {
  senderId: number;
  content: string;
  sentAt: string;
};

/**
 * 목록 응답. 미처리(UNPROCESSED)는 요약형이라 targetMemberId 가 오고 처리 결과가 없으며,
 * 나머지 필터는 상세형이라 처리 결과가 오는 대신 targetMemberId 가 없다.
 */
export type AdminReport = {
  id: number;
  reporterNickname: string;
  reportType: ReportType;
  reportReason: ReportReason;
  description: string | null;
  isProcessed: boolean;
  createdAt: string;
  targetId: number;
  targetUrl?: string | null;
  targetMemberId?: number | null;
  targetMemberNickname?: string | null;
  adminNickname?: string | null;
  sanctionType?: SanctionType | null;
  sanctionReason?: string | null;
  sanctionStartDate?: string | null;
  sanctionEndDate?: string | null;
  isSanctionActive?: boolean | null;
  chatRoomId?: string | null;
  messageId?: string | null;
  messageContent?: string | null;
  messageSentAt?: string | null;
  messageContext?: ReportMessageContext[] | null;
};

export type AdminReportPage = {
  items: AdminReport[];
  page: number;
  hasMore: boolean;
};

export type SanctionRequest = {
  reportId: number;
  targetMemberId: number;
  sanctionType: SanctionType;
  sanctionReason?: string;
  sanctionEndAt?: string;
};
