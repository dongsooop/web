export type PasswordValidationResult = {
  isValid: boolean;
  message: string;
};

export function validateSchoolEmailLocalPart(value: string) {
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+$/.test(trimmed);
}

export function buildSchoolEmail(localPart: string) {
  const trimmed = localPart.trim();
  return trimmed ? `${trimmed}@dongyang.ac.kr` : '';
}

export function validateNickname(value: string) {
  const trimmed = value.trim();

  if (trimmed.length < 2 || trimmed.length > 8) {
    return false;
  }

  return !/[^가-힣a-zA-Z0-9]/.test(trimmed);
}

export function validatePassword(value: string) {
  return analyzePassword(value).isValid;
}

export function analyzePassword(value: string): PasswordValidationResult {
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
