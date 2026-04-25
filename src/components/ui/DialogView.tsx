'use client';

import ConfirmDialog from './ConfirmDialog';
import { useDialogStore } from '@/store/useDialogStore';

export default function DialogView() {
  const dialog = useDialogStore((state) => state.dialog);
  const hideDialog = useDialogStore((state) => state.hideDialog);

  if (!dialog) return null;

  const {
    title,
    content,
    cancel,
    confirm,
    onConfirm,
    onClose,
    isSingleAction = false,
    variant = 'primary',
  } = dialog;

  const handleConfirm = () => {
    hideDialog();
    onConfirm();
  };

  const handleClose = () => {
    hideDialog();
    onClose?.();
  };

  if (isSingleAction) {
    return (
      <ConfirmDialog
        open
        title={title}
        content={content}
        cancel={cancel}
        confirm={confirm}
        onConfirm={handleConfirm}
        onClose={onClose ? handleClose : undefined}
        isSingleAction
        variant={variant}
      />
    );
  }

  return (
    <ConfirmDialog
      open
      title={title}
      content={content}
      cancel={cancel}
      confirm={confirm}
      onConfirm={handleConfirm}
      onClose={handleClose}
      variant={variant}
    />
  );
}
