import {
  timetableDays,
  timetableEndHour,
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

function endHourText(value: string) {
  return Math.floor((minuteText(value) - 1) / 60);
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
  const previewStartHour = preview ? hourText(preview.startAt) : null;
  const previewEndHour = preview ? endHourText(preview.endAt) : null;
  const startCandidates = [
    ...source.map((item) => hourText(item.startAt)),
    ...(previewStartHour !== null ? [previewStartHour] : []),
  ];
  const endCandidates = [
    ...source.map((item) => endHourText(item.endAt)),
    ...(previewEndHour !== null ? [previewEndHour] : []),
  ];
  const visibleStartHour =
    startCandidates.length > 0 ? Math.min(...startCandidates) : timetableStartHour;
  const visibleEndHour = endCandidates.length > 0 ? Math.max(...endCandidates) : timetableEndHour;
  const visibleHours = Array.from(
    { length: Math.max(visibleEndHour - visibleStartHour + 1, 1) },
    (_, i) => visibleStartHour + i,
  );
  const lectures = source
    .map((item, index) => ({
      id: item.id,
      day: dayIndexByWeek[item.week],
      end: minuteText(item.endAt),
      start: minuteText(item.startAt),
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
  const dayMinutes = visibleStartHour * 60;
  const endMinutes = (visibleHours[visibleHours.length - 1] + 1) * 60;
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
          {visibleHours.map((hour, hourIndex) => (
            <div
              key={hour}
              className={`border-schedule-gridLine text-gray5 flex h-14 items-start justify-center pt-2 text-[9px] font-semibold sm:text-caption ${
                hourIndex < visibleHours.length - 1 ? 'border-b' : ''
              }`}
            >
              {timeText(hour)}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-5">
            {visibleHours.flatMap((hour, hourIndex) =>
              timetableDays.map((day, dayIndex) => (
                <div
                  key={`${day}-${hour}`}
                  className={`${dayIndex < timetableDays.length - 1 ? 'border-r' : ''} ${
                    hourIndex < visibleHours.length - 1 ? 'border-b' : ''
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

          <div
            className="absolute inset-0 grid grid-cols-5"
            style={{ gridTemplateRows: `repeat(${visibleHours.length}, minmax(0, 3.5rem))` }}
          >
            {lectures.map((lecture) => {
              const top = ((lecture.start - dayMinutes) / 60) * cellHeight;
              const height = ((lecture.end - lecture.start) / 60) * cellHeight;
              const showTeacher = lecture.teacher && lecture.end - lecture.start > 60;

              return (
                <article
                  key={lecture.id}
                  onClick={() => onSelectAction?.(lecture.value)}
                  className={`absolute z-10 flex min-h-11 cursor-pointer flex-col border px-1.5 py-1 text-left sm:px-3 sm:py-1.5 ${timetableTones[lecture.tone]}`}
                  style={{
                    height: `${height}px`,
                    left: `${lecture.day * 20}%`,
                    top: `${top}px`,
                    width: '20%',
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
                  {showTeacher ? (
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
