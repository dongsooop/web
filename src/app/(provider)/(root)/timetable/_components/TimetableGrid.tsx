import { days, hours, startHour, tones, type TimetableItem, type WeekKey } from './timetable.data';

const dayIndexByWeek: Record<WeekKey, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const toneKeys = Object.keys(tones) as Array<keyof typeof tones>;

function timeText(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`;
}

function hourText(value: string) {
  return Number(value.slice(0, 2));
}

function cardRow(start: number) {
  return start - startHour + 1;
}

function cardSpan(start: number, end: number) {
  return Math.max(end - start, 1);
}

type TimetableGridProps = {
  lectures: TimetableItem[];
  onSelectAction?: (lecture: TimetableItem) => void;
};

export default function TimetableGrid({ lectures: source, onSelectAction }: TimetableGridProps) {
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
    .filter((item) => item.day < days.length);

  return (
    <div className="border-schedule-gridLine overflow-x-auto rounded-2xl border bg-white">
      <div className="grid-cols-timetable-xs grid-rows-timetable-shell grid w-full min-w-0 sm:grid-cols-timetable-sm lg:grid-cols-timetable">
        <div className="border-schedule-gridLine border-r border-b bg-white" />

        <div className="grid grid-cols-5">
          {days.map((day, dayIndex) => (
            <div
              key={day}
              className={`border-schedule-gridLine flex h-9 items-center justify-center border-b text-[10px] font-semibold text-black sm:text-bodySm ${
                dayIndex < days.length - 1 ? 'border-r' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="border-schedule-gridLine border-r">
          {hours.map((hour, hourIndex) => (
            <div
              key={hour}
              className={`border-schedule-gridLine text-gray5 flex h-14 items-start justify-center pt-2 text-[9px] font-semibold sm:text-caption ${
                hourIndex < hours.length - 1 ? 'border-b' : ''
              }`}
            >
              {timeText(hour)}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-5">
            {hours.flatMap((hour, hourIndex) =>
              days.map((day, dayIndex) => (
                <div
                  key={`${day}-${hour}`}
                  className={`${dayIndex < days.length - 1 ? 'border-r' : ''} ${
                    hourIndex < hours.length - 1 ? 'border-b' : ''
                  } border-schedule-gridLine h-14`}
                />
              )),
            )}
          </div>

          <div className="grid-rows-timetable absolute inset-0 grid grid-cols-5">
            {lectures.map((lecture) => {
              const span = cardSpan(lecture.start, lecture.end);

              return (
                <article
                  key={lecture.id}
                  onClick={() => onSelectAction?.(lecture.value)}
                  className={`z-10 flex min-h-11 cursor-pointer flex-col border px-1.5 py-1 text-left sm:px-3 sm:py-1.5 ${tones[lecture.tone]}`}
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
