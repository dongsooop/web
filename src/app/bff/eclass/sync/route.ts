import { NextRequest } from 'next/server';

import { proxyEclass } from '@/features/eclass/server/eclass.proxy';

export async function POST(request: NextRequest) {
  return proxyEclass(request, '/sync', { method: 'POST' });
}
