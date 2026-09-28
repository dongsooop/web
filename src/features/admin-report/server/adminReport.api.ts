import 'server-only';

import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { ReportFilter, SanctionRequest } from '../types';

type AdminRequestOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
};

function getRequiredEnv(
  name: 'REPORTS_ENDPOINT' | 'SANCTION_WRITE_ENDPOINT' | 'REPORT_WRITE_ENDPOINT',
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

/** 정렬을 붙이지 않으면 순서가 보장되지 않아 항상 createdAt 내림차순으로 요청한다. */
function buildListUrl(filter: ReportFilter, page: number, size: number) {
  const query = new URLSearchParams({
    filter,
    page: String(page),
    size: String(size),
  });

  query.append('sort', 'createdAt,desc');

  return `${getRequiredEnv('REPORTS_ENDPOINT')}?${query.toString()}`;
}

export async function fetchAdminReports(
  options: AdminRequestOptions & { filter: ReportFilter; page: number; size: number },
) {
  return serverFetchAuth(buildListUrl(options.filter, options.page, options.size), {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function createSanction(options: AdminRequestOptions & { payload: SanctionRequest }) {
  return serverFetchAuth(getRequiredEnv('SANCTION_WRITE_ENDPOINT'), {
    method: 'POST',
    body: JSON.stringify(options.payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function dismissReport(options: AdminRequestOptions & { reportId: number }) {
  return serverFetchAuth(`${getRequiredEnv('REPORT_WRITE_ENDPOINT')}/${options.reportId}/dismiss`, {
    method: 'POST',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
