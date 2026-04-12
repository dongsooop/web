'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose?: () => void;
  isSingleAction?: boolean;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  confirmVariant?: 'primary' | 'danger';
  cancelVariant?: 'default' | 'danger';
}

export default function ConfirmDialog({
  open,
  title,
  content,
  cancelText = '취소',
  confirmText = '확인',
  onConfirm,
  onClose,
  isSingleAction = false,
  confirmVariant = 'primary',
  cancelVariant = 'default',
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSingleAction) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, isSingleAction, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (isSingleAction) return;
    onClose?.();
  };

  const confirmTextClass =
    confirmVariant === 'danger'
      ? 'text-warning hover:bg-warning/5'
      : 'text-primary hover:bg-primary/5';

  const cancelTextClass =
    cancelVariant === 'danger' ? 'text-warning hover:bg-warning/5' : 'text-gray6 hover:bg-gray1';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="animate-in fade-in zoom-in-95 w-full max-w-[440px] overflow-hidden rounded-[16px] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left">
          <h2 className="text-large font-bold text-black">{title}</h2>

          <p className="text-normal mt-3 leading-relaxed whitespace-pre-line text-black">
            {content}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-8 flex justify-end gap-1">
          {!isSingleAction && (
            <button
              type="button"
              onClick={onClose}
              className={`text-normal min-h-[44px] rounded-lg px-4 py-2 font-semibold transition-colors ${cancelTextClass}`}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`text-normal min-h-[44px] rounded-lg px-4 py-2 text-[15px] font-semibold transition-all active:scale-[0.97] ${confirmTextClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
