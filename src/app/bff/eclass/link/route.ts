import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { proxyEclass } from '@/features/eclass/server/eclass.proxy';
import type { EclassLinkRequest } from '@/features/eclass/types';

export async function GET(request: NextRequest) {
  return proxyEclass(request, '/link');
}

export async function DELETE(request: NextRequest) {
  return proxyEclass(request, '/link', { method: 'DELETE' });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<EclassLinkRequest>;
  const token = body.token?.trim();

  if (!token) {
    return NextResponse.json(
      { message: '이클래스 연동 정보를 확인하지 못했어요. 다시 시도해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  return proxyEclass(request, '/link', { method: 'POST', body: { token } });
}
