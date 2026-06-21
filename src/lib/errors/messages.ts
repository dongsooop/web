import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '../api/apiError';

type Scope =
  | 'home'
  | 'cafeteria'
  | 'restaurant'
  | 'auth'
  | 'signup'
  | 'schedule'
  | 'timetable'
  | 'mypage'
  | 'social';

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

function commonExceptBadRequest(err: unknown): string | null {
  if (err instanceof ApiError && err.status === HttpStatusCode.BAD_REQUEST) {
    return null;
  }

  return common(err);
}

const socialMessages = {
  login: '소셜 로그인 중 오류가 발생했어요.',
  state: '소셜 계정 연동 정보를 불러오는 중\n오류가 발생했어요.',
  link: '소셜 계정을 연동하는 중에 오류가 발생했어요.',
  unlink: '소셜 계정을 연동 해제하는 중에 오류가 발생했어요.',
  rateLimit: '카카오 로그인 요청이 너무 자주 발생했어요.\n잠시 후 다시 시도해 주세요.',
  missingLink:
    '회원가입 또는 소셜 로그인 연결 정보가 없어요.\n로그인 후 마이페이지에서 소셜 로그인 연결을 먼저 해주세요',
  unauthorizedUnlink: '회원 정보를 확인하는 데 실패했어요\n잠시 후에 다시 시도해 주세요',
} as const;

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
  restaurant: (err) => {
    return (
      common(err) ?? '맛집 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
    );
  },
  schedule: (err, context) => {
    if (context === 'create') {
      return common(err) ?? '일정을 등록하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.';
    }

    if (context === 'update') {
      return common(err) ?? '일정을 수정하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.';
    }

    if (context === 'delete') {
      return common(err) ?? '일정을 삭제하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.';
    }

    return common(err) ?? '일정 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.';
  },
  timetable: (err, context) => {
    if (context === 'create') {
      return (
        commonExceptBadRequest(err) ??
        '시간표를 등록하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
      );
    }

    if (context === 'update') {
      return (
        commonExceptBadRequest(err) ??
        '시간표를 수정하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
      );
    }

    if (context === 'delete') {
      return (
        commonExceptBadRequest(err) ??
        '시간표를 삭제하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
      );
    }

    if (context === 'fetch') {
      return (
        commonExceptBadRequest(err) ??
        '시간표 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
      );
    }

    return (
      common(err) ?? '시간표 데이터를 처리하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.'
    );
  },
  mypage: (err) => {
    return common(err) ?? '마이페이지를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
  },
  social: (err, context) => {
    if (context === 'kakaoRateLimit') {
      return socialMessages.rateLimit;
    }

    if (context === 'sdk') {
      return socialMessages.login;
    }

    if (context === 'state') {
      return socialMessages.state;
    }

    if (err instanceof ApiError) {
      if (context === 'login' && err.status === HttpStatusCode.BAD_REQUEST) {
        return socialMessages.missingLink;
      }

      if (context === 'unlink' && err.status === HttpStatusCode.UNAUTHORIZED) {
        return socialMessages.unauthorizedUnlink;
      }
    }

    if (context === 'login') {
      return socialMessages.login;
    }

    if (context === 'link') {
      return socialMessages.link;
    }

    if (context === 'unlink') {
      return socialMessages.unlink;
    }

    return common(err) ?? socialMessages.login;
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
        if (context === 'deleteAccount') {
          return common(err) ?? '회원 탈퇴 중 오류가 발생했어요.';
        }
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
