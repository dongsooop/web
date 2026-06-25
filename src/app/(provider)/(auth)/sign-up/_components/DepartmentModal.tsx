'use client';

import { useEffect } from 'react';
import { DEPARTMENTS } from '@/constants/department';
import { Check, X } from 'lucide-react';
import { lockBody, unlockBody } from '@/lib/body-lock';

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
  const titleId = 'department-modal-title';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lockBody();

    return () => {
      unlockBody();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-w-sheet flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:mx-8 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-gray1 sticky top-0 flex items-center justify-between rounded-t-2xl border-b bg-white p-5 sm:rounded-t-2xl">
          <h2 id={titleId} className="text-heading font-bold text-black">
            학과 선택
          </h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="학과 선택 닫기"
            className="text-gray4 min-h-11 cursor-pointer p-1 transition-colors"
          >
            <X size={24} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {DEPARTMENTS.filter((d) => d.code !== 'UNKNOWN').map((d) => (
            <button
              key={d.code}
              type="button"
              onClick={() => {
                onSelect(d.code);
                onClose();
              }}
              className={`active:bg-gray1 text-body flex min-h-11 w-full cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors ${
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
