export type ScheduleType = 'MEMBER' | 'OFFICIAL';

export type ScheduleResponseItem = {
  color?: string | null;
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
