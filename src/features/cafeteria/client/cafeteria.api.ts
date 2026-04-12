import { clientRequest } from '@/lib/api/clientRequest';

import type { CafeteriaResponse } from '../types';

{/* 브라우저 -> Next API */}
export async function fetchCafeteria() {
  return clientRequest<CafeteriaResponse>('/api/cafeteria', {
    method: 'GET',
  });
}
