'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, MapPin, X } from 'lucide-react';
import TimePicker from '@/components/ui/TimePicker';
import ScheduleDatePicker from './ScheduleDatePicker';
import { Divider } from '@/components/ui/Divider';

type ScheduleCreateFormProps = {
  mode: 'panel' | 'sheet';
  onCloseAction: () => void;
  onSaveAction: () => void;
};

type ColorItem = {
  id: string;
  bg: string;
};

function toTimeText(date: Date) {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
}

function getDefaultTimes(now: Date) {
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(Math.ceil(start.getMinutes() / 5) * 5, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    start: toTimeText(start),
    end: toTimeText(end),
  };
}

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

function DateField({
  label,
  value,
  onClickAction,
}: {
  label: string;
  value: string;
  onClickAction: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className="border-gray2 text-bodySm text-gray6 flex min-h-11 w-full cursor-pointer items-center justify-start rounded-xl border bg-white px-3 text-left"
    >
      <span className="shrink-0 font-semibold text-black">{label}</span>
      <span className="bg-gray2 mx-3 h-4 w-px shrink-0" />
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronDown className="text-gray5 h-4 w-4 shrink-0" />
    </button>
  );
}

function TimeField({
  value,
  onClickAction,
  disabled = false,
}: {
  value: string;
  onClickAction: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      disabled={disabled}
      className={[
        'border-gray2 text-bodySm text-gray6 flex min-h-11 items-center justify-start rounded-xl border bg-white px-3 text-left',
        disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
      ].join(' ')}
    >
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronDown className="text-gray5 h-4 w-4 shrink-0" />
    </button>
  );
}

export default function ScheduleCreateForm({
  mode,
  onCloseAction,
  onSaveAction,
}: ScheduleCreateFormProps) {
  const today = useMemo(() => new Date(), []);
  const defaultDate = useMemo(() => {
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }, [today]);
  const defaultTime = useMemo(() => getDefaultTimes(today), [today]);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('blue');
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultTime.start);
  const [endTime, setEndTime] = useState(defaultTime.end);
  const [dateTarget, setDateTarget] = useState<'start' | 'end' | null>(null);
  const [timeTarget, setTimeTarget] = useState<'start' | 'end' | null>(null);
  const titlePlaceholder = useMemo(() => '예) 스터디 모임', []);
  const placePlaceholder = useMemo(() => '예) 도서관 3층 세미나실', []);
  const bodyClass = mode === 'panel' ? 'overflow-visible px-4' : 'flex-1 overflow-y-auto px-4 py-5';
  const startDateText = useMemo(() => {
    const date = new Date(startDate);
    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${startDate.replaceAll('-', '.')} (${week})`;
  }, [startDate]);
  const endDateText = useMemo(() => {
    const date = new Date(endDate);
    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${endDate.replaceAll('-', '.')} (${week})`;
  }, [endDate]);

  const confirmDate = (value: string) => {
    if (dateTarget === 'start') {
      setStartDate(value);
      if (value > endDate) {
        setEndDate(value);
      }
    }

    if (dateTarget === 'end') {
      setEndDate(value < startDate ? startDate : value);
    }

    setDateTarget(null);
  };

  const confirmTime = (value: string) => {
    if (timeTarget === 'start') {
      setStartTime(value);
    }

    if (timeTarget === 'end') {
      setEndTime(value);
    }

    setTimeTarget(null);
  };

  return (
    <>
      <div className="flex flex-col bg-white">
        {mode === 'sheet' ? (
          <div className="bg-gray2 mx-auto mt-3 h-1 w-12 rounded-full sm:hidden" />
        ) : null}

        <div className="border-gray2 flex items-center justify-between px-4 pt-3">
          <h2 className="text-heading font-bold text-black">일정 추가</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="일정 추가 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Divider />
        <div className={bodyClass}>
          <div className="space-y-5">
            <section className="space-y-0">
              <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
                제목 <span className="text-primary ml-1">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={titlePlaceholder}
                maxLength={60}
                className={fieldClass()}
              />
              <p className="text-caption text-gray5 font-regular mt-2 mr-1 text-right">
                {title.length}/60
              </p>
            </section>

            <section className="space-y-0">
              <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
                날짜 <span className="text-primary ml-1">*</span>
              </label>
              <div className="space-y-2">
                <DateField
                  label="시작"
                  value={startDateText}
                  onClickAction={() => setDateTarget('start')}
                />
                <DateField
                  label="종료"
                  value={endDateText}
                  onClickAction={() => setDateTarget('end')}
                />
              </div>
            </section>

            <section className="space-y-0">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <label className="text-bodySm flex items-center font-semibold text-black">
                  시간 <span className="text-primary ml-1">*</span>
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
                <TimeField
                  value={startTime}
                  onClickAction={() => setTimeTarget('start')}
                  disabled={allDay}
                />
                <span className="text-bodySm text-gray5 text-center font-semibold">~</span>
                <TimeField
                  value={endTime}
                  onClickAction={() => setTimeTarget('end')}
                  disabled={allDay}
                />
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
                  maxLength={20}
                  className={[fieldClass(), 'pr-11'].join(' ')}
                />
                <MapPin className="text-gray5 absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
              </div>
              <p className="text-caption text-gray5 font-regular mt-2 mr-1 text-right">
                {place.length}/20
              </p>
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

        <div className="my-3 grid shrink-0 grid-cols-2 gap-3 bg-white p-4">
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

      <ScheduleDatePicker
        key={dateTarget ? `${dateTarget}-${dateTarget === 'end' ? endDate : startDate}` : 'date'}
        open={dateTarget !== null}
        value={dateTarget === 'end' ? endDate : startDate}
        min={dateTarget === 'end' ? startDate : undefined}
        onCloseAction={() => setDateTarget(null)}
        onConfirmAction={confirmDate}
      />

      <TimePicker
        key={timeTarget ? `${timeTarget}-${timeTarget === 'end' ? endTime : startTime}` : 'time'}
        open={timeTarget !== null}
        value={timeTarget === 'end' ? endTime : startTime}
        onCloseAction={() => setTimeTarget(null)}
        onConfirmAction={confirmTime}
      />
    </>
  );
}
