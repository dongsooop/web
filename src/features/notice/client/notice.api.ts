import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { NoticePageUi, NoticeTab } from '../types/ui-model';

export async function fetchNoticePage(tab: NoticeTab, page: number) {
  const query = new URLSearchParams({
    tab,
    page: String(page),
  });

  return clientRequestAuth<NoticePageUi>(`/bff/notices?${query.toString()}`, {
    method: 'GET',
  });
}
