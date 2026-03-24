import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '../api/apiError';

type Scope = 'home' | 'cafeteria' | 'auth';

function common(err: unknown): string | null {
  if (err instanceof ApiError) {
    const { status } = err;

    if (status === HttpStatusCode.NETWORK_ERROR) {
      return '네트워크 연결이 원활하지 않아요.';
    }

    if (status >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
      return '서버 오류가 발생했어요.';
    }

    if (status === HttpStatusCode.BAD_REQUEST) {
      return '잘못된 접근이에요.';
    }

    return null;
  }

  if (err instanceof Error) {
    return '일시적인 오류가 발생했어요. 다시 시도해주세요.';
  }

  return '알 수 없는 오류가 발생했어요.';
}

const scopeMessages: Record<Exclude<Scope, 'common'>, (err: unknown) => string> = {
  home: (err) => {
    return (
      common(err) ?? '홈 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
    );
  },
  cafeteria: (err) => {
    return (
      common(err) ??
      '학식 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
    );
  },
  auth: (err) => {
    if (err instanceof ApiError) {
      if (err.status === HttpStatusCode.BAD_REQUEST) {
        return '아이디 또는 비밀번호가 잘못되었습니다.';
      }

      if (err.status === HttpStatusCode.FORBIDDEN) {
        return '현재 제재 중인 계정입니다. 고객센터에 문의해주세요.';
      }

      if (err.status === HttpStatusCode.NOT_FOUND) {
        return '등록된 회원 정보를 찾을 수 없습니다.';
      }
    }

    return common(err) ?? '로그인 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
  },
};

export function getErrorMessage(scope: Scope, err: unknown) {
  return scopeMessages[scope](err);
}
