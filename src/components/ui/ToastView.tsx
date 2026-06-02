'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, CircleAlert, Info } from 'lucide-react';

import { useToastStore } from '@/store/useToastStore';

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

const TOAST_WIDTH_MAP = {
  default: 'max-w-[420px]',
  wide: 'max-w-[800px]',
} as const;

export default function ToastView() {
  const pathname = usePathname();
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);
  const isAuthPage =
    pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/password-reset';

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      hideToast();
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [toast, hideToast]);

  if (!toast) return null;

  const style = TOAST_STYLE_MAP[toast.tone];
  const widthClass = TOAST_WIDTH_MAP[toast.width];
  const Icon = style.icon;
  const isSocialAction = toast.position === 'socialAction' && pathname === '/mypage/social';

  if (isSocialAction) {
    return (
      <div
        key={toast.id}
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] px-4 lg:top-[116px] lg:bottom-auto lg:px-6"
      >
        <div className={`mx-auto w-full max-w-[800px] ${isAuthPage ? '' : 'lg:pl-18'}`}>
          <div className="flex justify-center lg:justify-start">
            <div
              className={`animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] duration-200 ${style.className}`}
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

  return (
    <div
      key={toast.id}
      className={`pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4 ${
        isAuthPage ? '' : 'lg:pl-18'
      }`}
    >
      <div
        className={`animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full ${widthClass} items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] duration-200 ${style.className}`}
        role="status"
        aria-live="polite"
      >
        <Icon className={`h-5 w-5 shrink-0 ${style.iconClassName}`} />
        <p className="text-body min-w-0 flex-1 font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
