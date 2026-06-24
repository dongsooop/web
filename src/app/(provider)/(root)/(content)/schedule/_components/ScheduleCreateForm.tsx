'use client';

import { Check, ChevronDown, MapPin, Trash2 } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { FieldLabel, FieldLegend } from '@/components/ui/FieldTitle';
import { useScheduleForm } from '@/features/schedule/hooks/useScheduleForm';
import ScheduleDateTimePicker from '@/components/common/date-time-picker/DateTimePicker';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import type { ScheduleColorToken } from '@/features/schedule/types/form';
import type { Schedule } from '@/features/schedule/types/ui-model';
import { useScheduleCreate } from './ScheduleCreateContext';

type ScheduleCreateFormProps = {
  initialDate?: Date;
  isDeleting?: boolean;
  isSaving?: boolean;
  mode: 'page' | 'panel';
  onCloseAction?: () => void;
  onDeleteAction?: () => void | Promise<void>;
  onSaveAction?: (payload: ScheduleCreateRequest) => Promise<void>;
  schedule?: Schedule;
};

type ColorItem = {
  id: ScheduleColorToken;
  bg: string;
  label: string;
};

const colors: ColorItem[] = [
  { id: 'red', bg: 'bg-schedule-redLine', label: '빨간색' },
  { id: 'yellow', bg: 'bg-schedule-yellowLine', label: '노란색' },
  { id: 'green', bg: 'bg-schedule-greenLine', label: '초록색' },
  { id: 'blue', bg: 'bg-schedule-blueLine', label: '파란색' },
  { id: 'purple', bg: 'bg-schedule-purpleLine', label: '보라색' },
];

function fieldClass() {
  return 'border-gray2 text-bodySm focus:border-primary min-h-11 w-full rounded-xl border bg-white px-3 text-black outline-none placeholder:text-gray5';
}

type DateTimeFieldProps = {
  label: string;
  dateText: string;
  timeText: string;
  open: boolean;
  onClickAction: () => void;
  disabled?: boolean;
};

function DateTimeField({
  label,
  dateText,
  timeText,
  open,
  onClickAction,
  disabled = false,
}: DateTimeFieldProps) {
  const valueText = `${dateText} ${timeText}`.trim();

  return (
    <button
      type="button"
      onClick={onClickAction}
      disabled={disabled}
      aria-expanded={open}
      aria-label={`${label} 일시 선택: ${valueText}`}
      className={[
        'border-gray2 flex min-h-11 w-full items-center justify-between rounded-xl border bg-white px-4 text-left',
        disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center">
        <span className="text-bodySm font-regular shrink-0 text-black">{label}</span>
        <span className="bg-gray2 mx-3 h-4 w-px shrink-0" aria-hidden="true" />
        <span className="text-bodySm min-w-0 truncate text-black">{valueText}</span>
      </div>

      <ChevronDown
        className={['text-gray5 h-4 w-4 shrink-0 transition', open ? 'rotate-180' : ''].join(' ')}
        aria-hidden="true"
      />
    </button>
  );
}

export default function ScheduleCreateForm({
  initialDate,
  isDeleting = false,
  isSaving = false,
  mode,
  onCloseAction,
  onDeleteAction,
  onSaveAction,
  schedule,
}: ScheduleCreateFormProps) {
  const bodyClass = mode === 'panel' ? 'overflow-visible px-4' : 'flex-1 overflow-y-auto px-4 py-5';
  const context = useScheduleCreate();
  const closeCreate = onCloseAction ?? context?.closeCreate;
  const saveCreate = onSaveAction ?? context?.saveCreate;
  const formTitle = schedule ? '일정 편집' : '일정 추가';
  const showSaving = isSaving;
  const showDeleting = isDeleting;
  const isPending = showSaving || showDeleting;

  const {
    form: { title, setTitle, place, setPlace, allDay, setAllDay, color, setColor, startAt },
    view: { startDateText, endDateText, startTimeText, endTimeText, invalidTimeRange, pickerValue },
    picker: { target, open, close, confirm },
    action: { save },
  } = useScheduleForm({
    initialDate,
    schedule,
    onSaveAction: saveCreate ?? (async () => {}),
  });

  return (
    <>
      <form
        className="flex flex-col bg-white"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className="border-gray2 flex items-center justify-between px-4 pt-3">
          <h2 className="text-heading font-bold text-black">{formTitle}</h2>

          {schedule && onDeleteAction ? (
            <button
              type="button"
              onClick={() => {
                void onDeleteAction();
              }}
              disabled={isPending}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition disabled:cursor-default disabled:opacity-60"
              aria-label="일정 삭제"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <div className="h-11 w-11 shrink-0" aria-hidden="true" />
          )}
        </div>

        <Divider />

        <div className={bodyClass}>
          <div className="space-y-5">
            <section className="space-y-0">
              <FieldLabel required>제목</FieldLabel>

              <input
                disabled={isPending}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예) 스터디 모임"
                maxLength={60}
                aria-label="일정 제목"
                className={fieldClass()}
              />

              <p className="text-caption text-gray5 font-regular mt-2 mr-1 text-right">
                {title.length}/60
              </p>
            </section>

            <fieldset>
              <FieldLegend required>일시</FieldLegend>
              <div className="space-y-2">
                <DateTimeField
                  label="시작"
                  dateText={startDateText}
                  timeText={allDay ? '' : startTimeText}
                  open={target === 'start'}
                  onClickAction={() => open('start')}
                  disabled={allDay || isPending}
                />

                <DateTimeField
                  label="종료"
                  dateText={endDateText}
                  timeText={allDay ? '' : endTimeText}
                  open={target === 'end'}
                  onClickAction={() => open('end')}
                  disabled={allDay || isPending}
                />
              </div>

              <div className="flex min-h-11 items-center justify-end">
                <label className="flex min-h-11 cursor-pointer items-center gap-2">
                  <input
                    disabled={isPending}
                    type="checkbox"
                    checked={allDay}
                    onChange={(e) => setAllDay(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />

                  <span className="text-bodySm text-gray6 font-semibold">종일</span>
                </label>
              </div>

              {invalidTimeRange ? (
                <p className="text-caption text-warning-100 mt-2" role="alert">
                  종료 일시는 시작 일시보다 늦어야 해요.
                </p>
              ) : null}
            </fieldset>

            <section className="space-y-0">
              <FieldLabel>장소</FieldLabel>

              <div className="relative">
                <input
                  disabled={isPending}
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="예) 도서관 3층 세미나실"
                  maxLength={20}
                  aria-label="일정 장소"
                  className={[fieldClass(), 'pr-11'].join(' ')}
                />

                <MapPin
                  className="text-gray5 absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>

              <p className="text-caption text-gray5 font-regular mt-2 mr-1 text-right">
                {place.length}/20
              </p>
            </section>

            <fieldset>
              <FieldLegend>일정 색상</FieldLegend>

              <div className="flex flex-wrap items-center gap-3">
                {colors.map((item) => {
                  const selected = color === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isPending}
                      onClick={() => setColor(item.id)}
                      className="inline-flex h-11 w-7 cursor-pointer items-center justify-center rounded-full transition disabled:cursor-default disabled:opacity-60"
                      aria-pressed={selected}
                      aria-label={`${item.label} 일정 색상`}
                    >
                      <span
                        className={[
                          item.bg,
                          'flex h-7 w-7 items-center justify-center rounded-full',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {selected ? <Check className="h-4 w-4 text-white" strokeWidth={3} /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="my-3 grid shrink-0 grid-cols-2 gap-3 bg-white p-4">
          <Button
            type="button"
            onClick={closeCreate}
            disabled={isPending}
            color="text"
            className="border-gray2 text-bodySm text-gray6 min-h-11 rounded-xl border bg-white"
          >
            취소
          </Button>

          <Button
            type="submit"
            disabled={showDeleting}
            isLoading={showSaving}
            className="text-bodySm min-h-11 rounded-xl"
          >
            {schedule ? '수정' : '저장'}
          </Button>
        </div>
      </form>

      <ScheduleDateTimePicker
        key={target ? `${target}-${pickerValue.toISOString()}` : 'datetime'}
        open={target !== null}
        title={target === 'end' ? '종료 일시 선택' : '시작 일시 선택'}
        value={pickerValue}
        minDate={target === 'end' ? startAt : undefined}
        onCloseAction={close}
        onConfirmAction={confirm}
      />
    </>
  );
}
