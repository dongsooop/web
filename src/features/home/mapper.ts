import { HomeResponse } from './types';
import { HomeUiModel, TagTone } from './ui-model';

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

const RECRUIT_TAG_TONES: TagTone[] = ['blue', 'red', 'yellow'];

export function mapHomeResponseToUi(dto: HomeResponse): HomeUiModel {
  return {
    timetable: (dto.timetable ?? []).map((item) => ({
      ...item,
      timeRange: `${item.startAt} - ${item.endAt}`,
    })),

    schedules: (dto.schedules ?? []).map((item) => ({
      ...item,
      timeRange: `${item.startAt} - ${item.endAt}`,
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

    popularRecruitments: (dto.popular_recruitments ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
      tags: item.tags
        ? item.tags.split(',').map((tag, idx) => ({
            label: tag.trim(),
            tone: RECRUIT_TAG_TONES[idx] ?? 'gray',
          }))
        : [],
    })),
  };
}
