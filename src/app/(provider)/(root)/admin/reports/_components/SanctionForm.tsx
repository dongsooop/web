'use client';

import { useMemo, useState } from 'react';

import DateTimePicker from '@/components/common/date-time-picker/DateTimePicker';
import Button from '@/components/ui/Button';
import {
  availableSanctionTypes,
  formatReportDateTime,
  SANCTION_TYPE_LABEL,
} from '@/features/admin-report/labels';
import type { AdminReport, SanctionRequest, SanctionType } from '@/features/admin-report/types';
import { toDateKey, toTimeKey } from '@/utils/date';

const REASON_MAX_LENGTH = 500;

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <span className="text-bodySm flex min-h-11 items-center font-semibold text-black">
      {children}
      {required ? <span className="text-primary ml-1">*</span> : null}
    </span>
  );
}

type SanctionFormProps = {
  report: AdminReport;
  isPending: boolean;
  onSubmitAction: (payload: SanctionRequest) => void;
};

/** 백엔드는 시간대 없는 KST 문자열을 받는다. */
function toNaiveDateTime(value: Date) {
  return `${toDateKey(value)}T${toTimeKey(value)}:00`;
}

function defaultEndAt() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(0, 0, 0, 0);

  return date;
}

export default function SanctionForm({ report, isPending, onSubmitAction }: SanctionFormProps) {
  const options = useMemo(() => availableSanctionTypes(report.reportType), [report.reportType]);
  const [sanctionType, setSanctionType] = useState<SanctionType>(options[0]);
  const [reason, setReason] = useState('');
  const [endAt, setEndAt] = useState(defaultEndAt);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const needsEndAt = sanctionType === 'TEMPORARY_BAN';
  const targetMemberId = report.targetMemberId ?? null;

  const handleSubmit = () => {
    if (targetMemberId === null) {
      return;
    }

    onSubmitAction({
      reportId: report.id,
      targetMemberId,
      sanctionType,
      sanctionReason: reason.trim() || undefined,
      sanctionEndAt: needsEndAt ? toNaiveDateTime(endAt) : undefined,
    });
  };

  return (
    <div className="border-gray2 flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex flex-col gap-2">
        <FieldLabel required>제재 종류</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = option === sanctionType;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSanctionType(option)}
                className={`text-caption min-h-11 cursor-pointer rounded-lg border px-3 font-semibold ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray2 text-gray6 bg-white'
                }`}
              >
                {SANCTION_TYPE_LABEL[option]}
              </button>
            );
          })}
        </div>
      </div>

      {needsEndAt ? (
        <div className="flex flex-col gap-2">
          <FieldLabel required>정지 종료일</FieldLabel>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="border-gray2 text-body min-h-11 cursor-pointer rounded-lg border px-3 text-left text-black"
          >
            {formatReportDateTime(toNaiveDateTime(endAt))}
          </button>
        </div>
      ) : (
        <p className="text-caption text-gray5">
          {sanctionType === 'WARNING' || sanctionType === 'PERMANENT_BAN'
            ? '종료일을 비우면 영구로 처리돼요.'
            : '이 제재는 종료일을 쓰지 않아요.'}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <FieldLabel>제재 사유</FieldLabel>
        <textarea
          className="border-gray2 text-body min-h-20 rounded-lg border p-3"
          placeholder={`비우면 "${SANCTION_TYPE_LABEL[sanctionType]}"으로 저장돼요.`}
          maxLength={REASON_MAX_LENGTH}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <span className="text-caption text-gray5 text-right">
          {reason.length}/{REASON_MAX_LENGTH}
        </span>
      </div>

      {targetMemberId === null ? (
        <p className="text-caption text-warning">
          이 목록에는 대상 회원 정보가 없어 제재할 수 없어요. 미처리 탭에서 처리해 주세요.
        </p>
      ) : null}

      <Button
        variant="primary"
        className="sm:w-fit"
        disabled={targetMemberId === null}
        isLoading={isPending}
        onClick={handleSubmit}
      >
        제재하기
      </Button>

      <DateTimePicker
        open={isPickerOpen}
        title="정지 종료일"
        value={endAt}
        minDate={new Date()}
        onCloseAction={() => setIsPickerOpen(false)}
        onConfirmAction={(value) => {
          setEndAt(value);
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
