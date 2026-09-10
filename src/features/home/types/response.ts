export type TimeHHMM = `${string}:${string}`;

export type HomeTimetableItem = {
  title: string;
  startAt: TimeHHMM;
  endAt: TimeHHMM;
};

export type HomeScheduleType = 'MEMBER' | 'OFFICIAL';

export type HomeScheduleItem = {
  title: string;
  startAt: TimeHHMM;
  endAt: TimeHHMM;
  type: HomeScheduleType;
};

export type HomeNoticeType = 'OFFICIAL' | 'DEPARTMENT';

export type HomeNoticeItem = {
  title: string;
  link: string;
  type: HomeNoticeType;
};

export type HomeRecruitmentType = 'STUDY' | 'PROJECT' | 'TUTORING';

export type HomePopularRecruitmentItem = {
  id: number;
  title: string;
  content: string;
  tags: string;
  type: HomeRecruitmentType;
};

export type HomeEclassStatus = 'ACTIVE' | 'EXPIRED';

export type HomeEclassSummary = {
  linked: boolean;
  status: HomeEclassStatus | null;
  upcomingCount: number;
  nearestCourseName: string | null;
  nearestTitle: string | null;
  nearestDueAt: string | null;
  nearestDDay: number | null;
};

export type HomeResponse = {
  date: string;
  timetable: HomeTimetableItem[];
  schedules: HomeScheduleItem[];
  notices: HomeNoticeItem[];
  popular_recruitments: HomePopularRecruitmentItem[];
  eclass_assignment?: HomeEclassSummary | null;
};
