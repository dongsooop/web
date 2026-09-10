import { DAY_LABELS } from '@/utils/date';

import type { HomeEclassSummary, HomeResponse } from './types/response';
import type { HomeUiEclass, HomeUiModel } from './types/ui-model';

const SCHEDULE_LABELS = {
  MEMBER: '멤버',
  OFFICIAL: '공식',
} as const;

const NOTICE_LABELS = {
  OFFICIAL: {
    labels: ['동양공지', '학교생활'],
    typeLabel: '공지',
  },
  DEPARTMENT: {
    labels: ['학과공지', '학부'],
    typeLabel: '학과',
  },
} as const;

function formatHomeTime(value: string) {
  return value.slice(0, 5);
}

function formatDueLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getMonth() + 1}/${date.getDate()} (${DAY_LABELS[date.getDay()]}) ${formatHomeTime(value.slice(11))}`;
}

function formatDDayLabel(dDay: number) {
  if (dDay === 0) {
    return 'D-Day';
  }

  return dDay > 0 ? `D-${dDay}` : `D+${-dDay}`;
}

function mapEclassSummary(dto?: HomeEclassSummary | null): HomeUiEclass {
  if (!dto) {
    return { linked: false, status: null, upcomingCount: 0, nearest: null };
  }

  const hasNearest =
    dto.nearestTitle !== null && dto.nearestDueAt !== null && dto.nearestDDay !== null;

  return {
    linked: dto.linked,
    status: dto.status,
    upcomingCount: dto.upcomingCount,
    nearest: hasNearest
      ? {
          courseName: dto.nearestCourseName ?? '',
          title: dto.nearestTitle ?? '',
          dueLabel: formatDueLabel(dto.nearestDueAt ?? ''),
          dDayLabel: formatDDayLabel(dto.nearestDDay ?? 0),
          isUrgent: (dto.nearestDDay ?? 0) <= 1,
        }
      : null,
  };
}

export function mapHomeResponseToUi(dto: HomeResponse): HomeUiModel {
  return {
    timetable: (dto.timetable ?? []).map((item) => ({
      ...item,
      timeRange: `${formatHomeTime(item.startAt)} - ${formatHomeTime(item.endAt)}`,
    })),

    schedules: (dto.schedules ?? []).map((item) => ({
      ...item,
      timeRange: `${formatHomeTime(item.startAt)} - ${formatHomeTime(item.endAt)}`,
      typeLabel: SCHEDULE_LABELS[item.type],
    })),

    notices: dto.notices.map((item) => {
      const config = NOTICE_LABELS[item.type];
      return {
        ...item,
        typeLabel: config.typeLabel,
        tags: [
          { label: config.labels[0], tone: 'blue' as const },
          { label: config.labels[1], tone: 'red' as const },
        ],
      };
    }),

    eclass: mapEclassSummary(dto.eclass_assignment),
  };
}
