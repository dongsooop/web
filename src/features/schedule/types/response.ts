export type ScheduleType = 'MEMBER' | 'OFFICIAL';

export type ScheduleResponseItem = {
  id: number | null;
  title: string;
  location: string;
  startAt: string;
  endAt: string;
  type: ScheduleType;
};

export type ScheduleResponse = {
  schedules: ScheduleResponseItem[];
};
