'use client';

import TimePicker from '@/components/common/date-time-picker/TimePicker';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { FieldLabel, FieldLegend } from '@/components/ui/FieldTitle';
import {
  timetableTimeOptions,
  timetableWeekDays,
  type TimetableItem,
  type TimetablePreview,
} from '@/features/timetable/ui';
import { useDialogStore } from '@/store/useDialogStore';

type TimetableCreatePanelProps = {
  item?: TimetableItem;
  isSaving?: boolean;
  lectures?: TimetableItem[];
  mode?: 'page' | 'panel' | 'sheet';
  onPreviewAction?: (preview: TimetablePreview | null) => void;
  onSaveAction?: (payload: TimetableItem) => void | Promise<void>;
  onCloseAction: () => void;
};

type FormState = {
  endAt: string;
  location: string;
  name: string;
  professor: string;
  startAt: string;
  week: (typeof timetableWeekDays)[number]['key'] | '';
};

const baseForm: FormState = {
  endAt: '10:00',
  location: '',
  name: '',
  professor: '',
  startAt: '09:00',
  week: 'MONDAY',
};

function toMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function createTempId() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0];
  return -Number(value || 1);
}

function isOverlap(startAt: string, endAt: string, lecture: TimetableItem) {
  const start = toMinutes(startAt);
  const end = toMinutes(endAt);
  const lectureStart = toMinutes(lecture.startAt.slice(0, 5));
  const lectureEnd = toMinutes(lecture.endAt.slice(0, 5));

  return start < lectureEnd && end > lectureStart;
}

function fieldClass() {
  return 'border-gray2 text-bodySm focus:border-primary min-h-11 w-full rounded-xl border bg-white px-3 text-black outline-none placeholder:text-gray5';
}

function countClass() {
  return 'text-caption text-gray5 mt-1 mr-1 text-right';
}

type TimeChipProps = {
  label: string;
  onClickAction: () => void;
  placeholder: string;
  value: string;
};

function TimeChip({ label, onClickAction, placeholder, value }: TimeChipProps) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className="border-gray2 text-bodySm flex min-h-11 min-w-23 cursor-pointer items-center justify-between rounded-xl border bg-white px-3 text-left text-black"
      aria-label={`${label} 시간 선택`}
    >
      <span className={value ? 'text-black' : 'text-gray5'}>{value || placeholder}</span>
      <ChevronDown className="text-gray5 h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
  );
}

export default function TimetableCreatePanel({
  item,
  isSaving = false,
  lectures = [],
  mode = 'panel',
  onPreviewAction,
  onSaveAction,
  onCloseAction,
}: TimetableCreatePanelProps) {
  const showDialog = useDialogStore((state) => state.showDialog);
  const showCloseButton = mode !== 'page';
  const [form, setForm] = useState<FormState>(() =>
    item
      ? {
          endAt: item.endAt.slice(0, 5),
          location: item.location,
          name: item.name,
          professor: item.professor,
          startAt: item.startAt.slice(0, 5),
          week: item.week as FormState['week'],
        }
      : baseForm,
  );
  const [target, setTarget] = useState<'endAt' | 'startAt' | null>(null);
  const name = form.name.trim();

  useEffect(() => {
    if (!form.startAt || !form.endAt || !form.week) {
      onPreviewAction?.(null);
      return;
    }

    onPreviewAction?.({
      endAt: `${form.endAt}:00`,
      startAt: `${form.startAt}:00`,
      week: form.week,
    });
  }, [form, onPreviewAction]);

  const save = () => {
    if (isSaving) {
      return;
    }

    if (!name) {
      showDialog({
        title: '필수 값 확인',
        content: '강의명을 입력해주세요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }

    if (!form.week) {
      showDialog({
        title: '필수 값 확인',
        content: '요일을 선택해주세요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }

    if (!form.startAt || !form.endAt) {
      showDialog({
        title: '필수 값 확인',
        content: '강의 시간을 선택해주세요.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }

    if (toMinutes(form.startAt) >= toMinutes(form.endAt)) {
      showDialog({
        title: '시간 확인',
        content: '시작 시간은 종료 시간보다 빨라야 합니다.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }

    const hasOverlap = lectures.some((lecture) => {
      if (lecture.week !== form.week) return false;
      if (item && lecture.id === item.id) return false;

      return isOverlap(form.startAt, form.endAt, lecture);
    });

    if (hasOverlap) {
      showDialog({
        title: '시간 확인',
        content: '기존 강의와 시간이 겹칩니다.',
        confirm: '확인',
        isSingleAction: true,
        onConfirm: () => {},
      });
      return;
    }

    onSaveAction?.({
      endAt: `${form.endAt}:00`,
      id: item?.id ?? createTempId(),
      location: form.location.trim(),
      name,
      professor: form.professor.trim(),
      startAt: `${form.startAt}:00`,
      week: form.week,
    });
  };

  return (
    <>
      <aside
        className={[
          'flex min-h-0 flex-col bg-white',
          mode === 'sheet'
            ? 'max-h-[78vh] rounded-t-xl border-x border-t border-b-0'
            : mode === 'page'
              ? 'rounded-2xl'
              : 'h-full',
        ].join(' ')}
      >
        <header className="flex items-center justify-between px-4 pt-3">
          <h2 className="text-heading font-bold text-black">
            {item ? '강의 정보 수정' : '강의 추가'}
          </h2>

          {showCloseButton ? (
            <button
              type="button"
              onClick={onCloseAction}
              className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
              aria-label="닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <div className="h-11 w-11 shrink-0" aria-hidden="true" />
          )}
        </header>

        <Divider />

        <form
          className="flex-1 px-4 pb-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (isSaving) {
              return;
            }
            save();
          }}
        >
          <div className="space-y-5">
            <section>
              <FieldLabel required>강의명</FieldLabel>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="예) 데이터베이스"
                maxLength={15}
                className={fieldClass()}
              />
              <p className={countClass()}>{form.name.length}/15</p>
            </section>

            <section>
              <FieldLabel>강의실</FieldLabel>
              <input
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="예) 3-314"
                maxLength={10}
                className={fieldClass()}
              />
              <p className={countClass()}>{form.location.length}/10</p>
            </section>

            <section>
              <FieldLabel>교수명</FieldLabel>
              <input
                value={form.professor}
                onChange={(e) => setForm((prev) => ({ ...prev, professor: e.target.value }))}
                placeholder="예) 홍길동"
                maxLength={8}
                className={fieldClass()}
              />
              <p className={countClass()}>{form.professor.length}/8</p>
            </section>

            <fieldset>
              <FieldLegend required>요일</FieldLegend>

              <div className="flex flex-wrap gap-2">
                {timetableWeekDays.map((day) => {
                  const selected = form.week === day.key;

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, week: day.key }))}
                      aria-pressed={selected}
                      className={[
                        'border-gray2 text-bodySm inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border px-4 font-semibold transition',
                        selected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'text-gray6 bg-white',
                      ].join(' ')}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="pb-5">
              <FieldLegend required>시간</FieldLegend>

              <div className="flex items-center gap-2">
                <TimeChip
                  label="시작"
                  value={form.startAt}
                  placeholder="09:00"
                  onClickAction={() => setTarget('startAt')}
                />
                <span className="text-gray5 text-bodySm" aria-hidden="true">
                  ~
                </span>
                <TimeChip
                  label="종료"
                  value={form.endAt}
                  placeholder="10:00"
                  onClickAction={() => setTarget('endAt')}
                />
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                color="outline"
                onClick={onCloseAction}
                className="border-gray2 text-gray6"
              >
                취소
              </Button>

              <Button type="submit" isLoading={isSaving}>
                {item ? '수정' : '저장'}
              </Button>
            </div>
          </div>
        </form>
      </aside>

      <TimePicker
        open={target !== null}
        options={timetableTimeOptions}
        title="시간 선택"
        value={
          target === 'endAt'
            ? form.endAt || timetableTimeOptions[0]
            : target === 'startAt'
              ? form.startAt || timetableTimeOptions[0]
              : timetableTimeOptions[0]
        }
        onCloseAction={() => setTarget(null)}
        onConfirmAction={(value) => {
          if (!target) return;

          setForm((prev) => ({ ...prev, [target]: value }));
          setTarget(null);
        }}
      />
    </>
  );
}
