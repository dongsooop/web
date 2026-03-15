export async function proxyRequest(url: string, request: Request, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  
  const headers = new Headers(options.headers);
  
  const appCheckToken = request.headers.get('x-firebase-appcheck');
  if (appCheckToken) {
    headers.set('X-Firebase-AppCheck', appCheckToken);
  }
  
  headers.set('Content-Type', 'application/json');

  return fetch(`${base}${url}`, {
    ...options,
    headers,
  });
}