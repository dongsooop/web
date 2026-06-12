import {
  timetableDays,
  timetableHours,
  timetableStartHour,
  timetableTones,
  type TimetableItem,
  type TimetablePreview,
  type TimetableToneKey,
  type WeekKey,
} from '@/features/timetable/ui';

const dayIndexByWeek: Record<WeekKey, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const toneKeys = Object.keys(timetableTones) as TimetableToneKey[];

function timeText(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`;
}

function hourText(value: string) {
  return Number(value.slice(0, 2));
}

function minuteText(value: string) {
  const [hour, minute] = value.slice(0, 5).split(':').map(Number);
  return hour * 60 + minute;
}

function cardRow(start: number) {
  return start - timetableStartHour + 1;
}

function cardSpan(start: number, end: number) {
  return Math.max(end - start, 1);
}

type TimetableGridProps = {
  lectures: TimetableItem[];
  onSelectAction?: (lecture: TimetableItem) => void;
  preview?: TimetablePreview | null;
};

export default function TimetableGrid({
  lectures: source,
  onSelectAction,
  preview,
}: TimetableGridProps) {
  const lectures = source
    .map((item, index) => ({
    id: item.id,
    day: dayIndexByWeek[item.week],
    start: hourText(item.startAt),
    end: hourText(item.endAt),
    title: item.name,
    room: item.location,
    teacher: item.professor,
    tone: toneKeys[index % toneKeys.length],
    value: item,
  }))
    .filter((item) => item.day < timetableDays.length);
  const previewDay = preview ? dayIndexByWeek[preview.week] : -1;
  const previewStart = preview ? minuteText(preview.startAt) : 0;
  const previewEnd = preview ? minuteText(preview.endAt) : 0;
  const dayMinutes = timetableStartHour * 60;
  const endMinutes = (timetableHours[timetableHours.length - 1] + 1) * 60;
  const cellHeight = 56;
  const visibleStart = Math.max(previewStart, dayMinutes);
  const visibleEnd = Math.min(previewEnd, endMinutes);
  const previewTop = ((visibleStart - dayMinutes) / 60) * cellHeight;
  const previewHeight = ((visibleEnd - visibleStart) / 60) * cellHeight;
  const showPreview =
    previewDay >= 0 &&
    previewDay < timetableDays.length &&
    previewEnd > previewStart &&
    visibleEnd > visibleStart;

  return (
    <div className="border-schedule-gridLine overflow-x-auto rounded-2xl border bg-white">
      <div className="grid-cols-timetable-xs grid-rows-timetable-shell grid w-full min-w-0 sm:grid-cols-timetable-sm lg:grid-cols-timetable">
        <div className="border-schedule-gridLine border-r border-b bg-white" />

        <div className="grid grid-cols-5">
          {timetableDays.map((day, dayIndex) => (
            <div
              key={day}
              className={`border-schedule-gridLine flex h-9 items-center justify-center border-b text-[10px] font-semibold text-black sm:text-bodySm ${
                dayIndex < timetableDays.length - 1 ? 'border-r' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="border-schedule-gridLine border-r">
          {timetableHours.map((hour, hourIndex) => (
            <div
              key={hour}
              className={`border-schedule-gridLine text-gray5 flex h-14 items-start justify-center pt-2 text-[9px] font-semibold sm:text-caption ${
                hourIndex < timetableHours.length - 1 ? 'border-b' : ''
              }`}
            >
              {timeText(hour)}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-5">
            {timetableHours.flatMap((hour, hourIndex) =>
              timetableDays.map((day, dayIndex) => (
                <div
                  key={`${day}-${hour}`}
                  className={`${dayIndex < timetableDays.length - 1 ? 'border-r' : ''} ${
                    hourIndex < timetableHours.length - 1 ? 'border-b' : ''
                  } border-schedule-gridLine h-14`}
                />
              )),
            )}
          </div>

          {showPreview ? (
            <div className="pointer-events-none absolute inset-0 z-20">
              <div
                className="absolute bg-gray5/24"
                style={{
                  height: `${previewHeight}px`,
                  left: `${previewDay * 20}%`,
                  top: `${previewTop}px`,
                  width: '20%',
                }}
              />
            </div>
          ) : null}

          <div className="grid-rows-timetable absolute inset-0 grid grid-cols-5">
            {lectures.map((lecture) => {
              const span = cardSpan(lecture.start, lecture.end);

              return (
                <article
                  key={lecture.id}
                  onClick={() => onSelectAction?.(lecture.value)}
                  className={`z-10 flex min-h-11 cursor-pointer flex-col border px-1.5 py-1 text-left sm:px-3 sm:py-1.5 ${timetableTones[lecture.tone]}`}
                  style={{
                    gridColumn: lecture.day + 1,
                    gridRow: `${cardRow(lecture.start)} / span ${span}`,
                  }}
                >
                  <div className="truncate text-[9px] font-semibold sm:text-bodySm">
                    {lecture.title}
                  </div>
                  {lecture.room ? (
                    <div className="mt-0.5 text-[8px] font-semibold sm:mt-1 sm:text-caption">
                      {lecture.room}
                    </div>
                  ) : null}
                  {lecture.teacher && span > 1 ? (
                    <div className="mt-0.5 line-clamp-2 text-[8px] sm:text-caption">
                      {lecture.teacher}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
