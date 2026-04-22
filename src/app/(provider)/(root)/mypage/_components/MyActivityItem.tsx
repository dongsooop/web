'use client';

import type { ButtonHTMLAttributes } from 'react';
import { ChevronRight } from 'lucide-react';

type MyActivityItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function MyActivityItem({
  label,
  className = '',
  type = 'button',
  ...props
}: MyActivityItemProps) {
  return (
    <button
      type={type}
      {...props}
      className={`flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-1 text-left ${className}`}
    >
      <span className="text-normal font-regular text-black">{label}</span>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        <ChevronRight className="h-5 w-5 text-gray4" />
      </div>
    </button>
  );
}
