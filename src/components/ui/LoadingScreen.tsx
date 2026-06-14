'use client';

import { CircleAlert } from 'lucide-react';

type LoadingScreenProps = {
  message: string;
  wide?: boolean;
  tone?: 'loading' | 'error';
  boxed?: boolean;
  fill?: boolean;
};

export function LoadingScreen({
  message,
  wide = false,
  tone = 'loading',
  boxed = false,
  fill = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex w-full items-center justify-center px-6 py-8 ${
        fill
          ? 'h-full min-h-full bg-transparent'
          : boxed
            ? 'min-h-[252px] bg-transparent'
            : 'min-h-screen bg-white'
      }`}
    >
      <div
        className={`flex w-full flex-col items-center justify-center text-center ${
          wide ? 'max-w-[800px]' : 'max-w-[480px]'
        }`}
      >
        {tone === 'loading' ? (
          <div className="text-primary mb-4 h-10 w-10 animate-spin rounded-full border-4 border-current/90 border-t-transparent" />
        ) : (
          <CircleAlert className="text-warning mb-4 h-12 w-12 shrink-0" />
        )}
        <p className="text-body text-black">{message}</p>
      </div>
    </div>
  );
}
