export function buildAuthHeaders(options?: {
  baseHeaders?: HeadersInit;
  accessToken?: string;
  deviceToken?: string;
  cookieHeader?: string | null;
}): Headers {
  const headers = new Headers(options?.baseHeaders);

  if (options?.cookieHeader) {
    headers.set('Cookie', options.cookieHeader);
  }

  if (options?.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  if (options?.deviceToken) {
    headers.set('Device-Token', options.deviceToken);
  }

  return headers;
}