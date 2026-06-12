import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { mapNoticePage, mergeNoticePages } from '@/features/notice/mapper';
import type { NoticePageResponse } from '@/features/notice/types/response';
import type { NoticeTab } from '@/features/notice/types/ui-model';
import { ApiError } from '@/lib/api/apiError';
import { serverFetch } from '@/lib/api/serverFetch';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 7;

function getRequiredEnv(
  name: 'SCHOOL_NOTICE_ENDPOINT' | 'DEPARTMENT_NOTICE_ENDPOINT' | 'SCHOOL_URL',
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

function normalizeLink(link: string, schoolUrl: string) {
  if (link.startsWith('http')) {
    return link;
  }

  return `${schoolUrl}${link.startsWith('/') ? '' : '/'}${link}`;
}

function normalizePage(data: NoticePageResponse, schoolUrl: string): NoticePageResponse {
  return {
    ...data,
    content: (data.content ?? []).map((item) => ({
      ...item,
      link: normalizeLink(item.link, schoolUrl),
    })),
  };
}

function resolveHasMore(data: NoticePageResponse, size: number) {
  if (typeof data.last === 'boolean') {
    return !data.last;
  }

  if (typeof data.totalPages === 'number' && typeof data.number === 'number') {
    return data.number + 1 < data.totalPages;
  }

  if (typeof data.totalElements === 'number' && typeof data.number === 'number') {
    return (data.number + 1) * size < data.totalElements;
  }

  return data.content.length === size;
}

function buildNoticeUrl(endpoint: string, page: number, size: number) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  query.append('sort', 'createdAt,desc');
  query.append('sort', 'id,desc');

  return `${endpoint}?${query.toString()}`;
}

async function requestNoticePage(
  endpoint: string,
  appCheckToken: string,
  page: number,
  size: number,
) {
  const response = await serverFetch(buildNoticeUrl(endpoint, page, size), {
    method: 'GET',
    appCheckToken,
  });

  return response.json() as Promise<NoticePageResponse>;
}

function parseTab(value: string | null): NoticeTab {
  if (value === 'OFFICIAL' || value === 'DEPARTMENT') {
    return value;
  }

  return 'ALL';
}

function parsePage(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export async function GET(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const tab = parseTab(request.nextUrl.searchParams.get('tab'));
  const page = parsePage(request.nextUrl.searchParams.get('page'));
  const schoolEndpoint = getRequiredEnv('SCHOOL_NOTICE_ENDPOINT');
  const departmentRoot = getRequiredEnv('DEPARTMENT_NOTICE_ENDPOINT');
  const schoolUrl = getRequiredEnv('SCHOOL_URL');
  const { departmentType } = extractAuthContext(request);

  try {
    if (tab === 'OFFICIAL') {
      const school = normalizePage(
        await requestNoticePage(schoolEndpoint, appCheckToken, page - 1, PAGE_SIZE),
        schoolUrl,
      );

      return NextResponse.json(
        mapNoticePage({
          content: school.content,
          type: 'OFFICIAL',
          page,
          hasMore: resolveHasMore(school, PAGE_SIZE),
        }),
      );
    }

    if (tab === 'DEPARTMENT') {
      if (!departmentType) {
        return NextResponse.json(
          mapNoticePage({
            content: [],
            type: 'DEPARTMENT',
            page,
            hasMore: false,
          }),
        );
      }

      const department = normalizePage(
        await requestNoticePage(
          `${departmentRoot}${encodeURIComponent(departmentType)}`,
          appCheckToken,
          page - 1,
          PAGE_SIZE,
        ),
        schoolUrl,
      );

      return NextResponse.json(
        mapNoticePage({
          content: department.content,
          type: 'DEPARTMENT',
          page,
          hasMore: resolveHasMore(department, PAGE_SIZE),
        }),
      );
    }

    const requestSize = page * PAGE_SIZE;
    const schoolPromise = requestNoticePage(schoolEndpoint, appCheckToken, 0, requestSize);
    const departmentPromise = departmentType
      ? requestNoticePage(
          `${departmentRoot}${encodeURIComponent(departmentType)}`,
          appCheckToken,
          0,
          requestSize,
        )
      : Promise.resolve<NoticePageResponse>({ content: [] });

    const [schoolData, departmentData] = await Promise.all([schoolPromise, departmentPromise]);
    const school = normalizePage(schoolData, schoolUrl);
    const department = normalizePage(departmentData, schoolUrl);
    const end = page * PAGE_SIZE;
    const hasMore =
      school.content.length + department.content.length > end ||
      resolveHasMore(school, requestSize) ||
      resolveHasMore(department, requestSize);

    return NextResponse.json(
      mergeNoticePages({
        school: school.content,
        department: department.content,
        page,
        size: PAGE_SIZE,
        hasMore,
      }),
    );
  } catch (error: unknown) {
    const status =
      error instanceof ApiError && error.status !== HttpStatusCode.NETWORK_ERROR
        ? error.status
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Network Connection Failed',
        status,
      },
      { status },
    );
  }
}
