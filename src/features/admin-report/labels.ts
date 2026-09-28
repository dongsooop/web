import type { ReportReason, ReportType, SanctionType } from './types';

/** 영구 제재의 종료일. 백엔드가 이 값으로 내려준다. */
export const PERMANENT_SANCTION_END = '9999-12-31T23:59:59';

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  PROJECT_BOARD: '프로젝트 모집 게시글',
  STUDY_BOARD: '스터디 모집 게시글',
  MARKETPLACE_BOARD: '장터 게시글',
  TUTORING_BOARD: '튜터링 게시글',
  MEMBER: '회원',
  CHAT_MESSAGE: '채팅 메시지',
  BLINDDATE_MESSAGE: '과팅 메시지',
};

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  SPAM: '스팸/도배',
  INAPPROPRIATE_CONTENT: '부적절한 내용',
  HATE_SPEECH: '혐오 발언',
  FRAUD: '사기/허위 정보',
  PRIVACY_VIOLATION: '개인정보 침해',
  COPYRIGHT_INFRINGEMENT: '저작권 침해',
  OTHER: '기타',
};

export const SANCTION_TYPE_LABEL: Record<SanctionType, string> = {
  WARNING: '경고',
  TEMPORARY_BAN: '일시정지',
  PERMANENT_BAN: '영구정지',
  CONTENT_DELETION: '게시글 삭제',
  CHAT_KICK: '채팅방 추방',
};

const BOARD_REPORT_TYPES: ReportType[] = [
  'PROJECT_BOARD',
  'STUDY_BOARD',
  'MARKETPLACE_BOARD',
  'TUTORING_BOARD',
];

export function isBoardReport(reportType: ReportType) {
  return BOARD_REPORT_TYPES.includes(reportType);
}

export function isMessageReport(reportType: ReportType) {
  return reportType === 'CHAT_MESSAGE' || reportType === 'BLINDDATE_MESSAGE';
}

/**
 * 신고 종류별로 서버가 받아주는 제재만 고른다.
 * 게시글 삭제는 게시판 신고에만, 채팅방 추방은 채팅 신고에만 쓸 수 있고 그 밖에는 400 이 온다.
 */
export function availableSanctionTypes(reportType: ReportType): SanctionType[] {
  const common: SanctionType[] = ['WARNING', 'TEMPORARY_BAN', 'PERMANENT_BAN'];

  if (isBoardReport(reportType)) {
    return [...common, 'CONTENT_DELETION'];
  }

  if (reportType === 'CHAT_MESSAGE') {
    return [...common, 'CHAT_KICK'];
  }

  return common;
}

/** 응답의 날짜는 시간대 없는 KST 문자열이라 그대로 잘라 쓴다. */
export function formatReportDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  if (value.startsWith(PERMANENT_SANCTION_END.slice(0, 4))) {
    return '영구';
  }

  return value.replace('T', ' ').slice(0, 16);
}
