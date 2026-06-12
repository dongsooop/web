export type NoticeTab = 'ALL' | 'OFFICIAL' | 'DEPARTMENT';

export type NoticeTag = {
  label: string;
  tone: 'blue' | 'red';
};

export type NoticeUiItem = {
  id: number;
  title: string;
  writer: string;
  createdAt: string;
  dateLabel: string;
  link: string;
  type: 'OFFICIAL' | 'DEPARTMENT';
  tags: NoticeTag[];
};

export type NoticePageUi = {
  items: NoticeUiItem[];
  page: number;
  hasMore: boolean;
};
