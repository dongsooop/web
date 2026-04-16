import type { ScheduleType } from './response';

export type Schedule = {
  title: string;
  dateKey: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
};
