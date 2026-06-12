export type NoticeType = 'OFFICIAL' | 'DEPARTMENT';

export type NoticeItem = {
  id: number;
  writer: string;
  title: string;
  createdAt: string;
  link: string;
};

export type NoticePageResponse = {
  content: NoticeItem[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  last?: boolean;
};
