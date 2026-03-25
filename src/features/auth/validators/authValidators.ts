export function validatePassword(value: string) {
  const isAllowedChars =
    /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>~`[\]\\/\-_=+]+$/.test(value) &&
    !/[ㄱ-ㅎ가-힣ぁ-ゔァ-ヴー一-龥]/.test(value);

  const hasMinLength = value.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>~`[\]\\/\-_=+]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  return isAllowedChars && hasMinLength && hasLetter && hasSpecial && hasNumber;
}

export function validateNickname(value: string) {
  const trimmed = value.trim();
  const hasSpecial = /[^가-힣a-zA-Z0-9]/.test(trimmed);

  return trimmed.length >= 2 && trimmed.length <= 8 && !hasSpecial;
}

export function validateEmail(value: string) {
  return /^[a-zA-Z0-9._%+-]+@dongyang\.ac\.kr$/.test(value);
}