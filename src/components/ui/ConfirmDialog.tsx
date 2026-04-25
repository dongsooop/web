'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Info, X } from 'lucide-react';

interface DialogBaseProps {
  open: boolean;
  title: string;
  content: string;
  cancel?: string;
  confirm?: string;
  onConfirm: () => void;
  variant?: 'primary' | 'danger';
}

interface SingleActionDialogProps extends DialogBaseProps {
  isSingleAction: true;
  onClose?: () => void;
}

interface MultiActionDialogProps extends DialogBaseProps {
  isSingleAction?: false;
  onClose: () => void;
}

type DialogProps = SingleActionDialogProps | MultiActionDialogProps;

export default function ConfirmDialog({
  open,
  title,
  content,
  cancel = '취소',
  confirm = '확인',
  onConfirm,
  onClose,
  isSingleAction = false,
  variant = 'primary',
}: DialogProps) {
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

  const confirmClass =
    variant === 'danger'
      ? 'bg-warning text-white hover:opacity-95'
      : 'bg-primary text-white hover:opacity-95';

  const iconConfig =
    variant === 'danger'
      ? {
          icon: AlertCircle,
          wrapperClassName: 'bg-warning/10 text-warning-100',
        }
      : {
          icon: Info,
          wrapperClassName: 'bg-primary/5 text-primary',
        };

  const Icon = iconConfig.icon;
  const canClose = isSingleAction || Boolean(onClose);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (isSingleAction) {
      onConfirm();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="animate-in fade-in zoom-in-95 relative w-full max-w-[340px] overflow-hidden rounded-xl bg-white px-6 py-7 shadow-[0_16px_40px_rgba(15,23,42,0.14)] duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {canClose && (
          <button
            type="button"
            onClick={handleClose}
            className="text-gray5 hover:bg-gray7 absolute top-4 right-4 inline-flex h-11 min-h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors"
            aria-label="다이얼로그 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconConfig.wrapperClassName}`}
          >
            <Icon className="h-8 w-8" strokeWidth={2.2} />
          </div>

          <h2 className="text-large font-bold text-black">{title}</h2>

          <p className="text-normal text-gray5 mt-4 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        <div className={`mt-8 flex gap-3 ${isSingleAction ? 'flex-col' : 'flex-row'}`}>
          {!isSingleAction && (
            <button
              type="button"
              onClick={handleClose}
              className="text-normal border-gray2 text-gray6 min-h-11 flex-1 cursor-pointer rounded-xl border bg-white px-4 py-3 font-semibold"
            >
              {cancel}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`text-normal min-h-11 ${isSingleAction ? 'w-full' : 'flex-1'} cursor-pointer rounded-xl px-4 py-3 font-semibold transition-all active:scale-[0.98] ${confirmClass}`}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
