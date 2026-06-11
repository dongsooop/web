export type TimetableSemester = 'FIRST' | 'SECOND' | 'SUMMER' | 'WINTER';

export type TimetableWeekKey =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type TimetableLectureResponse = {
  id: number;
  name: string;
  professor: string;
  location: string;
  startAt: string;
  endAt: string;
  week: TimetableWeekKey;
};

export type TimetableResponse = {
  timetable: TimetableLectureResponse[];
};
