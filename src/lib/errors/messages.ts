import { ApiError } from '@/app/api/apiError';
import { HttpStatusCode } from '@/constants/httpStatusCode';

type Scope = 'home' | 'common';

function common(err: unknown): string | null {
  if (!(err instanceof ApiError)) return '알 수 없는 오류가 발생했어요.';
  const { status } = err;

  if (status === HttpStatusCode.NETWORK_ERROR) {
    return '네트워크 연결이 원활하지 않아요.\n인터넷 상태를 확인해주세요.';
  }

  if (status >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
    return '서버 오류가 발생했어요.\n잠시 후 다시 시도해주세요.';
  }

  if (status === HttpStatusCode.BAD_REQUEST) {
    return '잘못된 접근이예요.\n지속될 경우 관리자에게 문의해주세요.';
  }

  return null;
}

const scopeMessages: Record<Exclude<Scope, 'common'>, (err: unknown) => string> = {
  home: (err) => {
    return (
      common(err) ?? '홈 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
    );
  },
};

export function errorMessage(scope: Exclude<Scope, 'common'>, err: unknown) {
  return scopeMessages[scope](err);
}
