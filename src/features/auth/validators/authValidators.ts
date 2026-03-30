export type ValidationResult = {
  isValid: boolean;
  message: string;
};

// 학교 이메일 유효성 검사
export function validateSchoolEmailLocalPart(value: string) {
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+$/.test(trimmed);
}

// 학교 도메인과 결합
export function buildSchoolEmail(localPart: string) {
  const trimmed = localPart.trim();
  return trimmed ? `${trimmed}@dongyang.ac.kr` : '';
}

// 닉네임 유효성 검사
export function validateNickname(value: string) {
  return analyzeNickname(value).isValid;
}

// 닉네임 상태 분석 및 메시지 반환
export function analyzeNickname(value: string): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      message: '2~8자 (특수문자 제외)로 입력해 주세요',
    };
  }

  if (trimmed.length < 2 || trimmed.length > 8) {
    return {
      isValid: false,
      message: '2~8글자로 입력해 주세요',
    };
  }

  const specialCharReg = /[^a-zA-Z0-9가-힣]/;
  if (specialCharReg.test(trimmed)) {
    return {
      isValid: false,
      message: '닉네임에 특수문자를 포함할 수 없어요',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

// 비밀번호 유효성 검사
export function validatePassword(value: string) {
  return analyzePassword(value).isValid;
}

// 비밀번호 상태 분석 및 메시지 반환
export function analyzePassword(value: string): ValidationResult {
  const isEnglishValid =
    /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>~`[\]\\/\-_=+]+$/.test(value) &&
    !/[ㄱ-ㅎ가-힣ぁ-ゔァ-ヴー一-龥]/.test(value);

  if (!isEnglishValid) {
    return {
      isValid: false,
      message: '영문, 숫자, 특수문자만 사용 가능해요',
    };
  }

  if (value.length < 8) {
    return {
      isValid: false,
      message: '8자 이상 입력해 주세요',
    };
  }

  if (!/[a-zA-Z]/.test(value)) {
    return {
      isValid: false,
      message: '영문을 1개 이상 포함해야 해요',
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>~`[\]\\/\-_=+]/.test(value)) {
    return {
      isValid: false,
      message: '특수문자를 1개 이상 포함해야 해요',
    };
  }

  if (!/[0-9]/.test(value)) {
    return {
      isValid: false,
      message: '숫자를 1개 이상 포함해야 해요',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}
