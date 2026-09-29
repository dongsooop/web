import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { fetchAdminReports } from '@/features/admin-report/server/adminReport.api';
import { readAdminContext, toAdminError } from '@/features/admin-report/server/adminReport.route';
import type { AdminReport, ReportFilter } from '@/features/admin-report/types';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';

const PAGE_SIZE = 20;
const FILTERS: ReportFilter[] = ['ALL', 'UNPROCESSED', 'PROCESSED', 'ACTIVE_SANCTIONS'];

function parseFilter(value: string | null): ReportFilter {
  return FILTERS.includes(value as ReportFilter) ? (value as ReportFilter) : 'UNPROCESSED';
}

function parsePage(value: string | null) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

export async function GET(request: NextRequest) {
  const { context, error } = readAdminContext(request);

  if (!context) {
    return error;
  }

  const filter = parseFilter(request.nextUrl.searchParams.get('filter'));
  const page = parsePage(request.nextUrl.searchParams.get('page'));

  try {
    const result = await fetchAdminReports({ ...context, filter, page, size: PAGE_SIZE });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const items = (await result.response.json()) as AdminReport[];
    const list = Array.isArray(items) ? items : [];

    // 전체 개수가 없는 배열 응답이라, 받은 개수가 한 페이지보다 적으면 마지막으로 본다
    const response = NextResponse.json({
      items: list,
      page,
      hasMore: list.length === PAGE_SIZE,
    });

    applyAuthResult(response, result);

    return response;
  } catch (requestError) {
    return toAdminError(requestError);
  }
}
