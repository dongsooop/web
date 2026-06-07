export function lockBody() {
  const { body, documentElement } = document;
  const count = Number(body.dataset.lockCount ?? '0');

  if (count === 0) {
    body.dataset.lockOverflow = body.style.overflow;
    body.dataset.lockPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  body.dataset.lockCount = String(count + 1);
}

export function unlockBody() {
  const { body } = document;
  const count = Number(body.dataset.lockCount ?? '0');

  if (count <= 1) {
    body.style.overflow = body.dataset.lockOverflow ?? '';
    body.style.paddingRight = body.dataset.lockPaddingRight ?? '';
    delete body.dataset.lockCount;
    delete body.dataset.lockOverflow;
    delete body.dataset.lockPaddingRight;
    return;
  }

  body.dataset.lockCount = String(count - 1);
}
