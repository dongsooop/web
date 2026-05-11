export function lockBody() {
  const { body, documentElement } = document;
  const count = Number(body.dataset.pickerLockCount ?? '0');

  if (count === 0) {
    body.dataset.pickerOverflow = body.style.overflow;
    body.dataset.pickerPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  body.dataset.pickerLockCount = String(count + 1);
}

export function unlockBody() {
  const { body } = document;
  const count = Number(body.dataset.pickerLockCount ?? '0');

  if (count <= 1) {
    body.style.overflow = body.dataset.pickerOverflow ?? '';
    body.style.paddingRight = body.dataset.pickerPaddingRight ?? '';
    delete body.dataset.pickerLockCount;
    delete body.dataset.pickerOverflow;
    delete body.dataset.pickerPaddingRight;
    return;
  }

  body.dataset.pickerLockCount = String(count - 1);
}
