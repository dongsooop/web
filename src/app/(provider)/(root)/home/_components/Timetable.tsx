'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { HomeUiModel } from '@/features/home/types/ui-model';

const TIMETABLE_ROW_HEIGHT = 50;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatDisplayTime(value: string) {
  return value.slice(0, 5);
}

type TimetableProps = {
  timetable: HomeUiModel['timetable'];
};

export default function Timetable({ timetable }: TimetableProps) {
  const { isLoggedIn } = useAuth();
  const slots = useMemo(
    () => [...timetable].sort((a, b) => toMinutes(a.startAt) - toMinutes(b.startAt)),
    [timetable],
  );

  return (
    <section className="border-gray2 flex h-full flex-col rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-normal font-semibold text-black">강의시간표</div>
          <div className="text-small text-gray5">오늘 수업을 한눈에 확인하세요</div>
        </div>

        {isLoggedIn ? (
          <Link
            href="/timetable"
            className="text-small text-gray5 hover:bg-gray1 inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-1"
            aria-label="더보기"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className="text-small text-gray4 inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full px-3 py-1"
            aria-label="로그인 후 이용 가능"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="bg-primary/5 relative mt-4 flex-1 rounded-xl p-4">
        {!isLoggedIn ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/35"
            aria-hidden="true"
          >
            <div className="text-small text-gray6 rounded-full bg-white/90 px-4 py-2 font-semibold shadow-sm backdrop-blur-sm">
              로그인이 필요한 서비스예요!
            </div>
          </div>
        ) : null}

        <div
          className={`${!isLoggedIn ? 'pointer-events-none blur-[3px] select-none' : ''}`}
          aria-hidden={!isLoggedIn}
        >
          {slots.length > 0 ? (
            <div className="flex flex-col gap-2">
              {slots.map((slot, index) => (
                <div
                  key={`${index}-${slot.title}-${slot.startAt}`}
                  className="grid grid-cols-[88px_1fr] items-center gap-3"
                >
                  <div
                    className="text-small text-gray5 flex h-full flex-col justify-between py-1 leading-4 font-semibold"
                    style={{ height: `${TIMETABLE_ROW_HEIGHT}px` }}
                  >
                    <span>{formatDisplayTime(slot.startAt)}</span>
                    <span>{formatDisplayTime(slot.endAt)}</span>
                  </div>

                  <div
                    className="from-primary via-primary/85 to-primary/30 flex items-center overflow-hidden rounded-lg bg-gradient-to-r px-3 shadow-sm"
                    style={{ height: `${TIMETABLE_ROW_HEIGHT}px` }}
                  >
                    <div className="flex h-full min-w-0 flex-col justify-center">
                      <div className="text-small truncate font-semibold text-white">
                        {slot.title}
                      </div>
                      <div className="text-[11px] text-white/90">
                        {slot.timeRange ??
                          `${formatDisplayTime(slot.startAt)} - ${formatDisplayTime(slot.endAt)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small text-gray5 flex min-h-[220px] items-center justify-center">
              오늘 예정된 수업이 없어요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
