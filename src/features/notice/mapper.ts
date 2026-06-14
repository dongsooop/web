import { formatYmdDot } from '@/utils/formatter/date';

import type { NoticeItem, NoticeType } from './types/response';
import type { NoticePageUi, NoticeUiItem } from './types/ui-model';

const NOTICE_LABELS = {
  OFFICIAL: ['동양공지', '학교생활'],
  DEPARTMENT: ['학과공지', '학부'],
} as const;

function toNoticeUi(item: NoticeItem, type: NoticeType): NoticeUiItem {
  const [first, second] = NOTICE_LABELS[type];

  return {
    ...item,
    type,
    dateLabel: formatYmdDot(item.createdAt),
    tags: [
      { label: first, tone: 'blue' },
      { label: second, tone: 'red' },
    ],
  };
}

export function mapNoticePage(params: {
  content: NoticeItem[];
  type: NoticeType;
  page: number;
  hasMore: boolean;
}): NoticePageUi {
  return {
    items: params.content.map((item) => toNoticeUi(item, params.type)),
    page: params.page,
    hasMore: params.hasMore,
  };
}

export function mergeNoticePages(params: {
  school: NoticeItem[];
  department: NoticeItem[];
  page: number;
  size: number;
  hasMore: boolean;
}): NoticePageUi {
  const merged = [
    ...params.school.map((item) => toNoticeUi(item, 'OFFICIAL')),
    ...params.department.map((item) => toNoticeUi(item, 'DEPARTMENT')),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);

  const start = (params.page - 1) * params.size;

  return {
    items: merged.slice(start, start + params.size),
    page: params.page,
    hasMore: params.hasMore,
  };
}
