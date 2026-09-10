import type { HomeEclassStatus, HomeNoticeType, HomeScheduleType, TimeHHMM } from './response';

export type HomeTag = {
  label: string;
  tone: TagTone;
};

export type TagTone = 'blue' | 'red' | 'yellow' | 'gray' | 'outline';

export type HomeUiModel = {
  timetable: HomeUiTimetableItem[];
  schedules: HomeUiScheduleItem[];
  notices: HomeUiNoticeItem[];
  eclass: HomeUiEclass;
};

export type HomeUiEclassNearest = {
  courseName: string;
  title: string;
  dueLabel: string;
  dDayLabel: string;
  isUrgent: boolean;
};

export type HomeUiEclass = {
  linked: boolean;
  status: HomeEclassStatus | null;
  upcomingCount: number;
  nearest: HomeUiEclassNearest | null;
};

export type HomeUiTimetableItem = {
  title: string;
  startAt: TimeHHMM;
  endAt: TimeHHMM;
  timeRange: string;
};

export type HomeUiScheduleItem = {
  title: string;
  startAt: TimeHHMM;
  endAt: TimeHHMM;
  timeRange: string;
  type: HomeScheduleType;
  typeLabel: string;
};

export type HomeUiNoticeItem = {
  title: string;
  link: string;
  type: HomeNoticeType;
  typeLabel: string;
  tags: {
    label: string;
    tone: 'blue' | 'red';
  }[];
};
