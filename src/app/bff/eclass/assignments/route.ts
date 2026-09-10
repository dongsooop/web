import { NextRequest } from 'next/server';

import { proxyEclass } from '@/features/eclass/server/eclass.proxy';

export async function GET(request: NextRequest) {
  return proxyEclass(request, '/assignments');
}
