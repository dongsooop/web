'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Slot = {
  start: string;
  end: string;
  title: string;
  room?: string;
};

const TIMES = ['09:00', '11:00', '13:00', '15:00', '17:00'];

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function Timetable() {
  const slots: Slot[] = [
    { start: '09:00', end: '10:50', title: '프로그래밍언어실습', room: '공학관 301' },
    { start: '13:00', end: '14:50', title: '자바프로그래밍', room: '공학관 210' },
  ];

  const startMin = 9 * 60;
  const endMin = 17 * 60;

  return (
    <section className="border-gray2 flex h-full flex-col rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-normal font-semibold text-black">강의시간표</div>
          <div className="text-small text-gray5">오늘 수업을 한눈에 확인하세요</div>
        </div>

        <Link
          href="/timetable"
          className="text-small text-gray5 hover:bg-gray1 inline-flex items-center gap-2 rounded-full px-2 py-1"
          aria-label="더보기"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-primary/5 mt-4 flex-1 rounded-xl p-4">
        <div className="grid grid-cols-[56px_1fr] gap-3">
          <div className="flex flex-col justify-between">
            {TIMES.map((t) => (
              <div key={t} className="text-small text-gray5">
                {t}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {slots.map((s, idx) => {
              const sMin = clamp(toMinutes(s.start), startMin, endMin);
              const eMin = clamp(toMinutes(s.end), startMin, endMin);

              const endMinute = eMin % 60;
              const fillPct = (endMinute / 60) * 100;
              const safeFill = clamp(fillPct, 0, 100);

              return (
                <div key={`${idx}-${s.title}`} className="flex items-center">
                  <div className="bg-gray1 relative h-12 w-full overflow-hidden rounded-xl">
                    <div
                      className="from-primary to-primary/60 absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r"
                      style={{ width: `${safeFill}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-4">
                      <div className="min-w-0">
                        <div className="text-small font-semibold text-white">{s.title}</div>
                        <div className="text-[11px] text-white/90">
                          {s.start} - {s.end}
                          {s.room ? ` · ${s.room}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
