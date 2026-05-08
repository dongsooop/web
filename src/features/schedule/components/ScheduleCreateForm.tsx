'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, MapPin, X } from 'lucide-react';

type ScheduleCreateFormProps = {
  mode: 'panel' | 'sheet';
  onCloseAction: () => void;
  onSaveAction: () => void;
};

type ColorItem = {
  id: string;
  bg: string;
};

const colors: ColorItem[] = [
  { id: 'red', bg: 'bg-schedule-create-redLine' },
  { id: 'yellow', bg: 'bg-schedule-create-yellowLine' },
  { id: 'green', bg: 'bg-schedule-create-greenLine' },
  { id: 'blue', bg: 'bg-schedule-create-blueLine' },
  { id: 'purple', bg: 'bg-schedule-create-purpleLine' },
];

function fieldClass() {
  return 'border-gray2 text-bodySm focus:border-primary min-h-11 w-full rounded-xl border bg-white px-3 text-black outline-none placeholder:text-gray5';
}

function SelectField({ value, label }: { value: string; label?: string }) {
  return (
    <div className="border-gray2 text-bodySm text-gray6 flex min-h-11 cursor-pointer items-center rounded-xl border bg-white px-3">
      {label ? (
        <>
          <span className="shrink-0 font-semibold text-black">{label}</span>
          <span className="bg-gray2 mx-3 h-4 w-px shrink-0" />
        </>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronDown className="text-gray5 h-4 w-4 shrink-0" />
    </div>
  );
}

export default function ScheduleCreateForm({
  mode,
  onCloseAction,
  onSaveAction,
}: ScheduleCreateFormProps) {
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('blue');
  const titlePlaceholder = useMemo(() => '예) 스터디 모임', []);
  const placePlaceholder = useMemo(() => '예) 도서관 3층 세미나실', []);
  const bodyClass =
    mode === 'panel' ? 'overflow-visible px-4 py-5' : 'flex-1 overflow-y-auto px-4 py-5';

  return (
    <div className="flex flex-col bg-white">
      {mode === 'sheet' ? (
        <div className="bg-gray2 mx-auto mt-3 h-1 w-12 rounded-full sm:hidden" />
      ) : null}

      <div className="border-gray2 flex items-center justify-between border-b px-4 pt-3 pb-1.5">
        <h2 className="text-heading font-bold text-black">일정 추가</h2>
        <button
          type="button"
          onClick={onCloseAction}
          className="text-gray5 hover:bg-gray7 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
          aria-label="일정 추가 닫기"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={bodyClass}>
        <div className="space-y-5">
          <section className="space-y-0">
            <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
              제목 <span className="text-primary">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={titlePlaceholder}
              className={fieldClass()}
            />
          </section>

          <section className="space-y-0">
            <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
              날짜 <span className="text-primary">*</span>
            </label>
            <div className="space-y-2">
              <SelectField label="시작" value="2026.05.13 (수)" />
              <SelectField label="종료" value="2026.05.13 (수)" />
            </div>
          </section>

          <section className="space-y-0">
            <div className="flex min-h-11 items-center justify-between gap-3">
              <label className="text-bodySm flex items-center font-semibold text-black">
                시간 <span className="text-primary">*</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
                <span className="text-bodySm text-gray6 font-semibold">종일</span>
              </label>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <SelectField value="14:00" />
              <span className="text-bodySm text-gray5 text-center font-semibold">~</span>
              <SelectField value="16:00" />
            </div>
          </section>

          <section className="space-y-0">
            <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
              장소
            </label>
            <div className="relative">
              <input
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder={placePlaceholder}
                className={[fieldClass(), 'pr-11'].join(' ')}
              />
              <MapPin className="text-gray5 absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
            </div>
          </section>

          <section className="space-y-0">
            <div className="text-bodySm flex min-h-11 items-center font-semibold text-black">
              일정 색상
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {colors.map((item) => {
                const selected = color === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setColor(item.id)}
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition"
                    aria-label={`${item.id} 색상 선택`}
                  >
                    <span
                      className={[
                        item.bg,
                        'flex h-7 w-7 items-center justify-center rounded-full',
                      ].join(' ')}
                    >
                      {selected ? <Check className="h-4 w-4 text-white" strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="border-gray2 shrink-0 grid grid-cols-2 gap-3 border-t bg-white px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={onCloseAction}
          className="border-gray2 text-bodySm text-gray6 min-h-11 cursor-pointer rounded-xl border bg-white px-4 font-semibold"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSaveAction}
          className="text-bodySm bg-primary min-h-11 cursor-pointer rounded-xl px-4 font-semibold text-white"
        >
          저장
        </button>
      </div>
    </div>
  );
}
