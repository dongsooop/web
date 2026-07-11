import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '../api/apiError';
import type { SocialErrorKey } from '@/features/auth/types/error';

type Scope =
  | 'home'
  | 'cafeteria'
  | 'chatbot'
  | 'restaurant'
  | 'auth'
  | 'signup'
  | 'passwordReset'
  | 'schedule'
  | 'timetable'
  | 'mypage'
  | 'social';

function networkMessage(err: unknown): string | null {
  if (err instanceof ApiError && err.status === HttpStatusCode.NETWORK_ERROR) {
    return '네트워크 연결이 원활하지 않아요.';
  }

  return null;
}

function commonFallback(err: unknown): string {
  if (err instanceof Error) {
    return '일시적인 오류가 발생했어요. 다시 시도해주세요.';
  }

  return '알 수 없는 오류가 발생했어요.';
}

function scopedMessage(err: unknown, message: string): string {
  return networkMessage(err) ?? (err instanceof ApiError ? message : commonFallback(err));
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
    return scopedMessage(
      err,
      '홈 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
    );
  },

  cafeteria: (err) => {
    return scopedMessage(
      err,
      '학식 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
    );
  },

  chatbot: (err) => {
    return scopedMessage(err, '응답에 실패했습니다. 잠시 후에 다시 시도해 주세요.');
  },

  restaurant: (err, context) => {
    if (err instanceof ApiError && err.status === HttpStatusCode.CONFLICT) {
      return '이미 등록된 맛집이에요.';
    }

    if (context === 'search') {
      return scopedMessage(
        err,
        '가게를 검색하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'create') {
      if (err instanceof ApiError && err.status === HttpStatusCode.BAD_REQUEST) {
        return '맛집 정보를 다시 확인해 주세요.';
      }

      return scopedMessage(
        err,
        '맛집을 등록하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'duplicate') {
      return scopedMessage(
        err,
        '맛집 중복 여부를 확인하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'like') {
      return scopedMessage(
        err,
        '좋아요를 처리하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    return scopedMessage(
      err,
      '맛집 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
    );
  },

  schedule: (err, context) => {
    if (context === 'create') {
      return scopedMessage(
        err,
        '일정을 등록하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'update') {
      return scopedMessage(
        err,
        '일정을 수정하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'delete') {
      return scopedMessage(
        err,
        '일정을 삭제하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    return scopedMessage(
      err,
      '일정 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
    );
  },

  timetable: (err, context) => {
    if (context === 'create') {
      return scopedMessage(
        err,
        '시간표를 등록하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'update') {
      return scopedMessage(
        err,
        '시간표를 수정하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'delete') {
      return scopedMessage(
        err,
        '시간표를 삭제하던 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    if (context === 'fetch') {
      return scopedMessage(
        err,
        '시간표 데이터를 조회하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      );
    }

    return scopedMessage(
      err,
      '시간표 데이터를 처리하는 과정에서 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
    );
  },

  mypage: (err) => {
    return scopedMessage(
      err,
      '마이페이지를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
    );
  },

  social: (err, context) => {
    if (typeof err === 'string') {
      switch (err as SocialErrorKey) {
        case 'SOCIAL_KAKAO_RATE_LIMIT':
          return socialMessages.rateLimit;
        case 'SOCIAL_SDK':
          return socialMessages.login;
        case 'SOCIAL_STATE':
          return socialMessages.state;
        case 'SOCIAL_MISSING_LINK':
          return socialMessages.missingLink;
        case 'SOCIAL_UNAUTHORIZED_UNLINK':
          return socialMessages.unauthorizedUnlink;
        case 'SOCIAL_LINK':
          return socialMessages.link;
        case 'SOCIAL_UNLINK':
          return socialMessages.unlink;
        case 'SOCIAL_LOGIN':
          return socialMessages.login;
        default:
          break;
      }
    }

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

    return scopedMessage(err, socialMessages.login);
  },

  auth: (err, context) => {
    if (typeof err === 'string') {
      switch (err) {
        case 'INPUT_EMAIL_REQUIRED':
          return '학교 이메일을 입력해 주세요.';
        case 'INPUT_PASSWORD_REQUIRED':
          return '비밀번호를 입력해 주세요.';
        case 'NO_USER_INFO_IN_RESPONSE':
          return '회원 정보를 불러오지 못했어요. 다시 시도해주세요.';
        default:
          break;
      }
    }

    if (err instanceof ApiError) {
      if (context === 'deleteAccount') {
        return scopedMessage(err, '회원 탈퇴 중 오류가 발생했어요.');
      }

      if (err.status === HttpStatusCode.BAD_REQUEST) {
        return '아이디 또는 비밀번호가 잘못되었습니다.';
      }

      if (err.status === HttpStatusCode.FORBIDDEN) {
        return '현재 제재 중인 계정입니다.';
      }

      if (err.status === HttpStatusCode.NOT_FOUND) {
        return '등록된 회원 정보를 찾을 수 없습니다.';
      }
    }

    return scopedMessage(err, '로그인 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
  },
  signup: (err, context) => {
    if (typeof err === 'string') {
      switch (err) {
        case 'INVALID_EMAIL_DOMAIN':
          return '학교 이메일(@dongyang.ac.kr)만 가입 가능해요.';
        case 'EXPIRED_CODE':
          return '인증 시간이 만료되었어요. 다시 요청해주세요.';
        case 'CODE_LIMIT_EXCEEDED':
          return '인증 시도 횟수를 초과했어요. 다시 인증 요청을 해주세요.';
        case 'INVALID_INPUT':
          return '이메일 형식이 올바르지 않아요.';
        default:
          break;
      }
    }

    if (err instanceof ApiError) {
      const { status } = err;

      if (context === 'checkEmail' && status === HttpStatusCode.CONFLICT) {
        return '사용 중인 이메일이에요.';
      }
      if (context === 'checkNickname' && status === HttpStatusCode.CONFLICT) {
        return '사용 중인 닉네임이에요.';
      }

      if (context === 'sendCode' && status === HttpStatusCode.BAD_REQUEST) {
        return '입력하신 이메일을 찾을 수 없어요.\n이메일을 다시 확인해 주세요';
      }

      if (context === 'verifyCode' && status === HttpStatusCode.BAD_REQUEST) {
        return '인증 코드가 일치하지 않아요.';
      }
    }

    return scopedMessage(err, '회원가입 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
  },

  passwordReset: (err, context) => {
    if (typeof err === 'string') {
      switch (err) {
        case 'INVALID_INPUT':
          return '이메일 형식이 올바르지 않아요.';
        case 'EMAIL_NOT_FOUND':
          return '가입되지 않은 학교 이메일이에요.';
        case 'UNKNOWN_ERROR':
          return '비밀번호 재설정 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        case 'PASSWORD_MISMATCH':
          return '비밀번호가 일치하지 않아요. 다시 확인해 주세요.';
        case 'INVALID_PASSWORD_FORMAT':
          return '비밀번호 형식을 다시 확인해 주세요.';
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

      if (context === 'sendCode' && err.status === HttpStatusCode.BAD_REQUEST) {
        return '입력하신 이메일을 찾을 수 없어요.\n이메일을 다시 확인해 주세요';
      }

      if (context === 'reset' && err.status === HttpStatusCode.BAD_REQUEST) {
        return '입력 정보를 다시 확인해 주세요.';
      }

      if (err.status === HttpStatusCode.NOT_FOUND) {
        return '가입되지 않은 학교 이메일이에요.';
      }
    }

    return scopedMessage(err, '비밀번호 재설정 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
  },
};

export function getErrorMessage(scope: Scope, err: unknown, context?: string | null) {
  return scopeMessages[scope](err, context ?? undefined);
}
