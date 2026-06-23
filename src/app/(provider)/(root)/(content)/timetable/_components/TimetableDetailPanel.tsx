'use client';

import { Pencil, Trash2, X } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';
import { getTimetableWeekLabel, type TimetableItem } from '@/features/timetable/ui';

type TimetableDetailPanelProps = {
  isDeleting?: boolean;
  isEditing?: boolean;
  lecture: TimetableItem;
  mode?: 'panel' | 'sheet';
  onCloseAction?: () => void;
  onDeleteAction: () => void;
  onEditAction: () => void;
};

export default function TimetableDetailPanel({
  isDeleting = false,
  isEditing = false,
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
        mode === 'sheet'
          ? 'max-h-[78vh] rounded-t-xl border-x border-t border-b-0 border-transparent'
          : 'h-full',
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

      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <div className="text-heading min-w-0 truncate font-bold text-black">{lecture.name}</div>
            <div className="text-bodySm text-gray5 shrink-0">{lecture.professor || ''}</div>
          </div>

          <div className="space-y-2">
            <div className="text-body text-black">
              {getTimetableWeekLabel(lecture.week)}
              <span className="inline-block w-3" aria-hidden="true" />
              {lecture.startAt.slice(0, 5)} ~ {lecture.endAt.slice(0, 5)}
            </div>

            <div className="text-body text-black">{lecture.location || ''}</div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onEditAction}
              disabled={isEditing}
              className="text-gray6 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-1 py-3 text-left disabled:cursor-default disabled:opacity-60"
            >
              <Pencil className="text-gray4 h-5 w-5 shrink-0" />
              <span className="text-bodySm">강의 정보 수정</span>
              {isEditing ? (
                <span
                  className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : null}
            </button>

            <button
              type="button"
              onClick={onDeleteAction}
              disabled={isDeleting}
              className="text-gray6 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-1 py-3 text-left disabled:cursor-default disabled:opacity-60"
            >
              <Trash2 className="text-gray4 h-5 w-5 shrink-0" />
              <span className="text-bodySm">강의 시간표 삭제</span>
              {isDeleting ? (
                <span
                  className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
