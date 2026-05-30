import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import type { DeviceType } from '../types/request';

export interface AuthContext {
  accessToken?: string;
  refreshToken?: string;
  deviceToken?: string;
  appCheckToken?: string;
  deviceType?: DeviceType;
  departmentType?: string;
}

function parseDeviceType(value?: string): DeviceType {
  if (value === 'ANDROID' || value === 'IOS') {
    return value;
  }

  return 'WEB';
}

export function extractAuthContext(request: NextRequest): AuthContext {
  return {
    accessToken: request.cookies.get('access_token')?.value,
    refreshToken: request.cookies.get('refresh_token')?.value,
    deviceToken: request.cookies.get('device_token')?.value,
    deviceType: parseDeviceType(request.cookies.get('device_type')?.value),
    departmentType: request.cookies.get('department_type')?.value,
    appCheckToken: request.headers.get('X-Firebase-AppCheck') || undefined,
  };
}

export function resolveDeviceContext(request: NextRequest) {
  const deviceToken = request.cookies.get('device_token')?.value || randomUUID();
  const deviceType = parseDeviceType(request.cookies.get('device_type')?.value);

  return {
    deviceToken,
    deviceType,
  };
}
