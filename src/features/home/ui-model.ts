import type { HomeNoticeType, HomeRecruitmentType, HomeScheduleType, TimeHHMM } from './types';

export type HomeUiModel = {
  timetable: HomeUiTimetableItem[];
  schedules: HomeUiScheduleItem[];
  notices: HomeUiNoticeItem[];
  popularRecruitments: HomeUiPopularRecruitmentItem[];
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

export type HomeUiPopularRecruitmentItem = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  type: HomeRecruitmentType;
  typeLabel: string;
};
