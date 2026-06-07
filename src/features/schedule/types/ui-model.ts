import type { ScheduleType } from './response';

export type Schedule = {
  color: string | null;
  id: number | null;
  title: string;
  location: string;
  startDateKey: string;
  endDateKey: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
};
