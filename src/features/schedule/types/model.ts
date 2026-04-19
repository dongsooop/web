import type { ScheduleType } from './response';

export type Schedule = {
  id: number | null;
  title: string;
  location: string;
  dateKey: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
};
