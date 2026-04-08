export function authorizationHeader(
  headers: Headers,
  accessToken?: string,
) {
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
}

export function deviceTokenHeader(
  headers: Headers,
  deviceToken?: string,
) {
  if (deviceToken) {
    headers.set('Device-Token', deviceToken);
  }
}