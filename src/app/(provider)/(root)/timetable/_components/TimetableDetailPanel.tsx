'use client';

import { Pencil, Trash2, X } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';

import { type TimetableItem, weekLabel } from './timetable.data';

type TimetableDetailPanelProps = {
  lecture: TimetableItem;
  mode?: 'panel' | 'sheet';
  onCloseAction?: () => void;
  onDeleteAction: () => void;
  onEditAction: () => void;
};

export default function TimetableDetailPanel({
  lecture,
  mode = 'panel',
  onCloseAction,
  onDeleteAction,
  onEditAction,
}: TimetableDetailPanelProps) {
  return (
    <aside
      className={[
        'flex min-h-0 flex-col bg-white',
        mode === 'sheet' ? 'max-h-[78vh] rounded-t-xl border-x border-t border-b-0' : 'h-full',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <h2 className="text-heading font-bold text-black">강의 정보</h2>

        {onCloseAction ? (
          <button
            type="button"
            onClick={onCloseAction}
            className="text-gray5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
            aria-label="강의 정보 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-11 w-11" aria-hidden="true" />
        )}
      </div>

      <Divider />

      <div className="flex-1 px-4 pb-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-title font-bold text-black">{lecture.name}</div>
            <div className="text-body text-gray5">{lecture.professor || '교수명 없음'}</div>
          </div>

          <div className="text-body text-black">
            {weekLabel(lecture.week)} {lecture.startAt.slice(0, 5)} ~ {lecture.endAt.slice(0, 5)}
          </div>

          <div className="text-body text-black">{lecture.location || '강의실 정보 없음'}</div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onEditAction}
              className="text-gray6 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-1 py-3 text-left"
            >
              <Pencil className="text-gray4 h-5 w-5 shrink-0" />
              <span className="text-bodySm">강의 정보 수정</span>
            </button>

            <button
              type="button"
              onClick={onDeleteAction}
              className="text-gray6 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-1 py-3 text-left"
            >
              <Trash2 className="text-gray4 h-5 w-5 shrink-0" />
              <span className="text-bodySm">강의 시간표 삭제</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
