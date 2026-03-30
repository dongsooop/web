import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '../api/apiError';

type Scope = 'home' | 'cafeteria' | 'auth' | 'signup';

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

const scopeMessages: Record<Scope, (err: unknown, context?: string) => string> = {
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
  auth: (err, context) => {
    if (context) {
      if (typeof err === 'string') {
        switch (err) {
          case 'EMAIL_NOT_FOUND':
            return '가입되지 않은 학교 이메일이에요.';
          case 'INVALID_INPUT':
            return '이메일 형식이 올바르지 않아요.';
          case 'PASSWORD_MISMATCH':
            return '비밀번호가 일치하지 않아요. 다시 확인해 주세요.';
          case 'CODE_LIMIT_EXCEEDED':
            return '인증 시도 횟수를 초과했어요. 다시 시도해주세요';
          default:
            break;
        }
      }
      if (err instanceof ApiError) {
        if (context === 'verifyCode' && err.status === HttpStatusCode.BAD_REQUEST) {
          return '인증 코드가 일치하지 않아요.';
        }
      }
    }
    if (err instanceof ApiError) {
      if (err.status === HttpStatusCode.BAD_REQUEST)
        return '아이디 또는 비밀번호가 잘못되었습니다.';
      if (err.status === HttpStatusCode.FORBIDDEN) return '현재 제재 중인 계정입니다.';
      if (err.status === HttpStatusCode.NOT_FOUND) return '등록된 회원 정보를 찾을 수 없습니다.';
    }

    return common(err) ?? '로그인 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
  },
  signup: (err, context) => {
    if (typeof err === 'string') {
      switch (err) {
        case 'DUPLICATE_EMAIL':
          return '이미 가입된 이메일이에요.';
        case 'DUPLICATE_NICKNAME':
          return '이미 사용 중인 닉네임이에요.';
        case 'INVALID_EMAIL_DOMAIN':
          return '학교 이메일(@dongyang.ac.kr)만 가입 가능해요.';
        case 'EXPIRED_CODE':
          return '인증 시간이 만료되었어요. 다시 요청해주세요.';
        case 'CODE_LIMIT_EXCEEDED':
          return '인증 시도 횟수를 초과했어요. 다시 인증 요청을 해주세요.';
        default:
          break;
      }
    }

    if (err instanceof ApiError) {
      const { status } = err;

      if (context === 'checkEmail' && status === HttpStatusCode.CONFLICT) {
        return '이미 사용 중인 이메일이에요.';
      }
      if (context === 'checkNickname' && status === HttpStatusCode.CONFLICT) {
        return '이미 사용 중인 닉네임이에요.';
      }
      if (context === 'verifyCode' && status === HttpStatusCode.BAD_REQUEST) {
        return '인증 코드가 일치하지 않아요.';
      }
    }

    return common(err) ?? '회원가입 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
  },
};

export function getErrorMessage(scope: Scope, err: unknown, context?: string | null) {
  return scopeMessages[scope](err, context ?? undefined);
}
