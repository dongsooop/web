import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

function getRequiredHomeEndpoint() {
  const endpoint = process.env.HOME_ENDPOINT;

  if (!endpoint) {
    throw new Error('환경 변수 HOME_ENDPOINT가 설정되지 않았습니다.');
  }

  return endpoint;
}

export async function fetchHome(options: {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  departmentType?: string;
}) {
  const endpoint = getRequiredHomeEndpoint();

  if (!options.departmentType) {
    throw new Error('departmentType가 없습니다.');
  }

  return serverFetchAuth(`${endpoint}/${options.departmentType}`, {
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
