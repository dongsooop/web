import type { ScheduleType } from './response';

export type ScheduleUiItem = {
  title: string;
  dateKey: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
  displayTime: string;
};

export type ScheduleUiModel = {
  schedules: ScheduleUiItem[];
};
