import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { AdminReportPage, ReportFilter, SanctionRequest } from '../types';

{/* Browser -> Next API */}
export function fetchAdminReportPage(filter: ReportFilter, page: number) {
  const query = new URLSearchParams({ filter, page: String(page) });

  return clientRequestAuth<AdminReportPage>(`/bff/admin/reports?${query.toString()}`, {
    method: 'GET',
  });
}

export function createSanction(payload: SanctionRequest) {
  return clientRequestAuth<void>('/bff/admin/reports/sanctions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function dismissReport(reportId: number) {
  return clientRequestAuth<void>(`/bff/admin/reports/${reportId}/dismiss`, {
    method: 'POST',
  });
}
