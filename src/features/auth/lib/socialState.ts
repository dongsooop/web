export function getSocialState(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return sessionStorage.getItem(key)?.trim() ?? '';
}

export function setSocialState(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(key, value);
}

export function clearSocialState(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(key);
}

export function isSocialStateValid(received: string, saved: string) {
  return !!received && !!saved && received === saved;
}
