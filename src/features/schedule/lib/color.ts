import type { Schedule } from '../types/ui-model';

function toneIndex(schedule: Schedule, count: number) {
  const seed = `${schedule.type}:${schedule.id ?? schedule.title}`;
  const value = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return value % count;
}

export function memberScheduleTone(schedule: Schedule) {
  const colors = [
    'bg-schedule-member-blueBg text-schedule-member-blueText',
    'bg-schedule-member-greenBg text-schedule-member-greenText',
    'bg-schedule-member-yellowBg text-schedule-member-yellowText',
  ];

  return colors[toneIndex(schedule, colors.length)];
}

export function officialScheduleTone(schedule: Schedule) {
  const colors = [
    'bg-schedule-official-purpleBg text-schedule-official-purpleText',
    'bg-schedule-official-greenBg text-schedule-official-greenText',
    'bg-schedule-official-blueBg text-schedule-official-blueText',
    'bg-schedule-official-orangeBg text-schedule-official-orangeText',
  ];

  return colors[toneIndex(schedule, colors.length)];
}

export function scheduleLineColor(schedule: Schedule) {
  if (schedule.type === 'OFFICIAL') {
    const colors = [
      'bg-schedule-official-purpleText',
      'bg-schedule-official-greenText',
      'bg-schedule-official-blueText',
      'bg-schedule-official-orangeText',
    ];

    return colors[toneIndex(schedule, colors.length)];
  }

  const colors = [
    'bg-schedule-member-blueText',
    'bg-schedule-member-greenText',
    'bg-schedule-member-yellowText',
  ];

  return colors[toneIndex(schedule, colors.length)];
}
