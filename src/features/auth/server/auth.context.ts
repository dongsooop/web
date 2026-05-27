import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

export interface AuthContext {
  accessToken?: string;
  refreshToken?: string;
  deviceToken?: string;
  appCheckToken?: string;
  deviceType?: string;
  departmentType?: string;
}

export function extractAuthContext(request: NextRequest): AuthContext {
  return {
    accessToken: request.cookies.get('access_token')?.value,
    refreshToken: request.cookies.get('refresh_token')?.value,
    deviceToken: request.cookies.get('device_token')?.value,
    deviceType: request.cookies.get('device_type')?.value || 'WEB',
    departmentType: request.cookies.get('department_type')?.value,
    appCheckToken: request.headers.get('X-Firebase-AppCheck') || undefined,
  };
}

export function resolveDeviceContext(request: NextRequest) {
  const deviceToken = request.cookies.get('device_token')?.value || randomUUID();
  const deviceType = request.cookies.get('device_type')?.value || 'WEB';

  return {
    deviceToken,
    deviceType,
  };
}
