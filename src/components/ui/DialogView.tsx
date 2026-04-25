'use client';

import ConfirmDialog from './ConfirmDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { useToastStore } from '@/store/useToastStore';

export default function DialogView() {
  const dialog = useDialogStore((state) => state.dialog);
  const hideDialog = useDialogStore((state) => state.hideDialog);
  const showToast = useToastStore((state) => state.showToast);

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

  const handleConfirm = async () => {
    hideDialog();

    try {
      await onConfirm();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '처리 중 오류가 발생했어요. 다시 시도해주세요.',
        'error',
      );
    }
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
