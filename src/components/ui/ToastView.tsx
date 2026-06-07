'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, CircleAlert, Info } from 'lucide-react';

import type { ToastTone, ToastWidth } from '@/store/useToastStore';
import { useToastStore } from '@/store/useToastStore';

type ToastItem = {
  className?: string;
  id?: number;
  message: string;
  tone: ToastTone;
  width?: ToastWidth;
  position?: 'top' | 'socialAction';
};

type ToastViewProps = {
  toast?: ToastItem | null;
  onHideAction?: () => void;
  containerClassName?: string;
  toastClassName?: string;
};

const TOAST_STYLE_MAP = {
  default: {
    icon: Info,
    className: 'border-gray2 bg-white text-black',
    iconClassName: 'text-gray5',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-primary/15 bg-white text-black',
    iconClassName: 'text-primary',
  },
  error: {
    icon: CircleAlert,
    className: 'border-warning/20 bg-white text-black',
    iconClassName: 'text-warning',
  },
} as const;

export default function ToastView({
  toast: externalToast,
  onHideAction,
  containerClassName = 'pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4',
  toastClassName = 'animate-in fade-in slide-in-from-top-2 pointer-events-auto duration-200',
}: ToastViewProps) {
  const storeToast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);
  const toast = externalToast ?? storeToast;
  const closeToast = onHideAction ?? hideToast;
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/password-reset';

  const widthClass = TOAST_WIDTH_MAP[toast?.width ?? 'default'];
  const isSocialAction = toast?.position === 'socialAction' && pathname === '/mypage/social';

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      closeToast();
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [toast, closeToast]);

  if (!toast) return null;

  const style = TOAST_STYLE_MAP[toast.tone];
  const Icon = style.icon;

  if (isSocialAction) {
    return (
      <div
        key={toast.id ?? toast.message}
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] px-4 lg:top-[116px] lg:bottom-auto lg:px-6"
      >
        <div className={`mx-auto w-full max-w-[800px] ${isAuthPage ? '' : 'lg:pl-18'}`}>
          <div className="flex justify-center lg:justify-start">
            <div
              className={`animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] duration-200 ${style.className} ${toast.className ?? ''}`.trim()}
              role="status"
              aria-live="polite"
            >
              <Icon className={`h-5 w-5 shrink-0 ${style.iconClassName}`} />
              <p className="text-normal min-w-0 flex-1 font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (externalToast) {
    return (
      <div key={toast.id ?? toast.message} className={containerClassName}>
        <div
          className={`flex w-full max-w-[420px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${style.className} ${toast.className ?? ''} ${toastClassName}`.trim()}
          role="status"
          aria-live="polite"
        >
          <Icon className={`h-5 w-5 shrink-0 ${style.iconClassName}`} />
          <p className="text-body min-w-0 flex-1 font-medium">{toast.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={toast.id ?? toast.message}
      className={`pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4 ${
        isAuthPage ? '' : 'lg:pl-18'
      }`}
    >
      <div
        className={`animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full ${widthClass} items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] duration-200 ${style.className} ${toast.className ?? ''}`.trim()}
        role="status"
        aria-live="polite"
      >
        <Icon className={`h-5 w-5 shrink-0 ${style.iconClassName}`} />
        <p className="text-body min-w-0 flex-1 font-medium">{toast.message}</p>
      </div>
    </div>
  );
}

const TOAST_WIDTH_MAP = {
  default: 'max-w-[420px]',
  wide: 'max-w-[800px]',
} as const;
