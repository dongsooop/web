import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { dismissReport } from '@/features/admin-report/server/adminReport.api';
import {
  readAdminContext,
  toAdminError,
  toAdminResponse,
} from '@/features/admin-report/server/adminReport.route';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { context, error } = readAdminContext(request);

  if (!context) {
    return error;
  }

  const { reportId } = await params;
  const parsed = Number(reportId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return NextResponse.json(
      { message: '신고를 찾을 수 없어요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    return toAdminResponse(await dismissReport({ ...context, reportId: parsed }));
  } catch (requestError) {
    return toAdminError(requestError);
  }
}
