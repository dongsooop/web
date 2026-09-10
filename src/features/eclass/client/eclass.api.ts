import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { EclassAssignmentListResponse, EclassLinkRequest, EclassLinkResponse } from '../types';

{/* Browser -> Next API */}
export function fetchEclassLink() {
  return clientRequestAuth<EclassLinkResponse>('/bff/eclass/link', { method: 'GET' });
}

export function linkEclass(payload: EclassLinkRequest) {
  return clientRequestAuth<EclassLinkResponse>('/bff/eclass/link', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function unlinkEclass() {
  return clientRequestAuth<void>('/bff/eclass/link', { method: 'DELETE' });
}

export function fetchEclassAssignments() {
  return clientRequestAuth<EclassAssignmentListResponse>('/bff/eclass/assignments', {
    method: 'GET',
  });
}

export function syncEclass() {
  return clientRequestAuth<void>('/bff/eclass/sync', { method: 'POST' });
}
