import { clientRequest } from '@/lib/api/clientRequest';
import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { HomeResponse } from '../types/response';

{/* Browser -> Next API */}
export async function fetchHome() {
  return clientRequestAuth<HomeResponse>('/bff/home', {
    method: 'GET',
  });
}

export async function fetchGuestHome() {
  return clientRequest<HomeResponse>('/bff/home/guest', {
    method: 'GET',
  });
}
