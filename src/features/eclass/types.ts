export type EclassLinkStatus = 'ACTIVE' | 'EXPIRED';

export type EclassLinkResponse = {
  linked: boolean;
  status: EclassLinkStatus | null;
  moodleFullname: string | null;
  lastSyncedAt: string | null;
};

export type EclassAssignment = {
  id: number;
  assignId: number;
  courseName: string;
  title: string;
  dueAt: string;
  cutoffAt: string | null;
  dDay: number;
  submitted: boolean;
  link: string;
};

export type EclassAssignmentListResponse = {
  linked: boolean;
  status: EclassLinkStatus | null;
  assignments: EclassAssignment[];
};

export type EclassLinkRequest = {
  username: string;
  password: string;
};
