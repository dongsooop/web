import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

function getRequiredHomeEndpoint() {
  const endpoint = process.env.HOME_ENDPOINT;

  if (!endpoint) {
    throw new Error('HOME_ENDPOINT_MISSING');
  }

  return endpoint;
}

function toDepartmentTypeSegment(departmentType?: string) {
  const normalized = departmentType?.trim();

  if (!normalized) {
    throw new Error('DEPARTMENT_TYPE_MISSING');
  }

  return encodeURIComponent(normalized);
}

export async function fetchHome(options: {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  departmentType?: string;
}) {
  const endpoint = getRequiredHomeEndpoint();
  const departmentTypeSegment = toDepartmentTypeSegment(options.departmentType);

  return serverFetchAuth(`${endpoint}/${departmentTypeSegment}`, {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function fetchGuestHome(options: {
  appCheckToken?: string;
}) {
  const endpoint = getRequiredHomeEndpoint();

  return serverFetch(endpoint, {
    method: 'GET',
    appCheckToken: options.appCheckToken,
  });
}
