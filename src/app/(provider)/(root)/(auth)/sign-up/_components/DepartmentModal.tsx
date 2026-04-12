'use client';

import { DEPARTMENTS } from '@/constants/department';
import { Check, X } from 'lucide-react';

interface DeptSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCode: string;
}

export default function DeptSelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedCode,
}: DeptSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[480px] flex-col rounded-t-[20px] bg-white shadow-xl sm:rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-gray1 sticky top-0 flex items-center justify-between rounded-t-[20px] border-b bg-white p-5 sm:rounded-t-[16px]">
          <h2 className="text-large font-bold text-black">학과 선택</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray4 min-h-[44px] p-1 transition-colors hover:text-black"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 pb-8">
          {DEPARTMENTS.filter((d) => d.code !== 'UNKNOWN').map((d) => (
            <button
              key={d.code}
              type="button"
              onClick={() => {
                onSelect(d.code);
                onClose();
              }}
              className={`active:bg-gray1 text-normal flex min-h-[44px] w-full items-center justify-between rounded-[12px] px-5 py-4 transition-colors ${
                selectedCode === d.code ? 'text-primary bg-primary-5 font-bold' : 'text-black'
              }`}
            >
              <span>{d.displayName}</span>
              {selectedCode === d.code && (
                <Check size={20} className="text-primary" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
