import { NextResponse } from 'next/server';

import { restoreSessionUser } from '@/features/auth/server/auth.service';
import { toSessionResponse } from '@/features/auth/mapper';

export async function GET() {
  const user = await restoreSessionUser();
  return NextResponse.json(toSessionResponse(user));
}