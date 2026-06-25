'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Info } from 'lucide-react';
import { lockBody, unlockBody } from '@/lib/body-lock';

interface DialogBaseProps {
  open: boolean;
  title: string;
  content: string;
  cancel?: string;
  confirm?: string;
  onConfirm: () => void;
  color?: 'primary' | 'danger';
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
  color = 'primary',
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    lockBody();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSingleAction) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockBody();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, isSingleAction, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (isSingleAction) return;
    onClose?.();
  };

  const confirmClass =
    color === 'danger'
      ? 'bg-warning text-white hover:opacity-95'
      : 'bg-primary text-white hover:opacity-95';

  const iconConfig =
    color === 'danger'
      ? {
          icon: AlertCircle,
          wrapperClassName: 'bg-warning/10 text-warning-100',
        }
      : {
          icon: Info,
          wrapperClassName: 'bg-primary/5 text-primary',
        };

  const Icon = iconConfig.icon;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="animate-in fade-in zoom-in-95 relative mx-4 w-full max-w-sm overflow-hidden rounded-xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconConfig.wrapperClassName}`}
          >
            <Icon className="h-8 w-8" strokeWidth={2.2} />
          </div>

          <h2 className="text-heading font-bold text-black">{title}</h2>

          <p className="text-body text-gray5 mt-4 leading-relaxed whitespace-pre-line">{content}</p>
        </div>

        <div className={`mt-8 flex gap-3 ${isSingleAction ? 'flex-col' : 'flex-row'}`}>
          {!isSingleAction && (
            <button
              type="button"
              onClick={onClose}
              className="text-body border-gray2 text-gray6 min-h-11 flex-1 cursor-pointer rounded-xl border bg-white px-4 py-3 font-semibold"
            >
              {cancel}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`text-body min-h-11 ${isSingleAction ? 'w-full' : 'flex-1'} cursor-pointer rounded-xl px-4 py-3 font-semibold transition-all active:scale-[0.98] ${confirmClass}`}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
