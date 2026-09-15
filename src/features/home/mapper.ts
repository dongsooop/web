import { DAY_LABELS } from '@/utils/date';

import type { HomeEclassItem, HomeEclassSummary, HomeResponse } from './types/response';
import type { HomeUiEclass, HomeUiEclassItem, HomeUiModel } from './types/ui-model';

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

const HOME_ECLASS_ITEM_LIMIT = 3;

function toEclassItem(
  courseName: string,
  title: string,
  dueAt: string,
  dDay: number,
): HomeUiEclassItem {
  return {
    courseName,
    title,
    dueLabel: formatDueLabel(dueAt),
    dDayLabel: formatDDayLabel(dDay),
    isUrgent: dDay <= 1,
  };
}

/** 백엔드가 목록(upcoming)을 주면 그대로 쓰고, 아직 주지 않으면 가장 임박한 한 건만 보여준다. */
function toEclassItems(dto: HomeEclassSummary): HomeUiEclassItem[] {
  const upcoming: HomeEclassItem[] = dto.upcoming ?? [];

  if (upcoming.length > 0) {
    return upcoming
      .slice(0, HOME_ECLASS_ITEM_LIMIT)
      .map((item) => toEclassItem(item.courseName, item.title, item.dueAt, item.dDay));
  }

  if (dto.nearestTitle === null || dto.nearestDueAt === null || dto.nearestDDay === null) {
    return [];
  }

  return [
    toEclassItem(dto.nearestCourseName ?? '', dto.nearestTitle, dto.nearestDueAt, dto.nearestDDay),
  ];
}

function mapEclassSummary(dto?: HomeEclassSummary | null): HomeUiEclass {
  if (!dto) {
    return { linked: false, status: null, upcomingCount: 0, items: [] };
  }

  return {
    linked: dto.linked,
    status: dto.status,
    upcomingCount: dto.upcomingCount,
    items: toEclassItems(dto),
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
