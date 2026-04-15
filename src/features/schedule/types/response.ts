export type ScheduleType = 'MEMBER' | 'OFFICIAL';

export type ScheduleItem = {
  title: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
};

export type ScheduleResponse = {
  schedules: ScheduleItem[];
};
