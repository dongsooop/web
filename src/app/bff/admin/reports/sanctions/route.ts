import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { createSanction } from '@/features/admin-report/server/adminReport.api';
import {
  readAdminContext,
  toAdminError,
  toAdminResponse,
} from '@/features/admin-report/server/adminReport.route';
import type { SanctionRequest } from '@/features/admin-report/types';

export async function POST(request: NextRequest) {
  const { context, error } = readAdminContext(request);

  if (!context) {
    return error;
  }

  const body = (await request.json().catch(() => ({}))) as Partial<SanctionRequest>;

  if (!body.reportId || !body.targetMemberId || !body.sanctionType) {
    return NextResponse.json(
      { message: '제재 정보를 올바르게 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (body.sanctionType === 'TEMPORARY_BAN' && !body.sanctionEndAt) {
    return NextResponse.json(
      { message: '일시정지는 종료일을 입력해야 해요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await createSanction({
      ...context,
      payload: {
        reportId: body.reportId,
        targetMemberId: body.targetMemberId,
        sanctionType: body.sanctionType,
        sanctionReason: body.sanctionReason?.trim() || undefined,
        sanctionEndAt: body.sanctionEndAt || undefined,
      },
    });

    return toAdminResponse(result);
  } catch (requestError) {
    return toAdminError(requestError);
  }
}
