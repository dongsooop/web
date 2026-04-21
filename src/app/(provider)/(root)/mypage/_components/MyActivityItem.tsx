'use client';

import { ChevronRight } from 'lucide-react';

type MyActivityItemProps = {
  label: string;
  onClick: () => void;
};

export default function MyActivityItem({ label, onClick }: MyActivityItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-1 text-left"
    >
      <span className="text-normal font-regular text-black">{label}</span>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        <ChevronRight className="h-5 w-5 text-gray4" />
      </div>
    </button>
  );
}
