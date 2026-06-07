import type { Schedule } from '../types/ui-model';

const toneByHex = {
  f28b82: 'bg-schedule-redBg text-schedule-redText',
  f4d03f: 'bg-schedule-yellowBg text-schedule-yellowText',
  '79c89d': 'bg-schedule-greenBg text-schedule-greenText',
  '8ecfa9': 'bg-schedule-greenBg text-schedule-greenText',
  '8bb8ff': 'bg-schedule-blueBg text-schedule-blueText',
  '9fc3ff': 'bg-schedule-blueBg text-schedule-blueText',
  b9a2f3: 'bg-schedule-purpleBg text-schedule-purpleText',
  f2be7a: 'bg-schedule-orangeBg text-schedule-orangeText',
} as const;

const lineByHex = {
  f28b82: 'bg-schedule-redLine',
  f4d03f: 'bg-schedule-yellowLine',
  '79c89d': 'bg-schedule-greenLine',
  '8ecfa9': 'bg-schedule-greenLine',
  '8bb8ff': 'bg-schedule-blueLine',
  '9fc3ff': 'bg-schedule-blueLine',
  b9a2f3: 'bg-schedule-purpleLine',
  f2be7a: 'bg-schedule-orangeLine',
} as const;

const defaultTone = 'bg-schedule-redBg text-schedule-redText';
const defaultLine = 'bg-schedule-redLine';
const officialToneFallback = [
  toneByHex.f28b82,
  toneByHex.b9a2f3,
  toneByHex['79c89d'],
  toneByHex['8bb8ff'],
  toneByHex.f2be7a,
] as const;
const officialLineFallback = [
  lineByHex.f28b82,
  lineByHex.b9a2f3,
  lineByHex['79c89d'],
  lineByHex['8bb8ff'],
  lineByHex.f2be7a,
] as const;

function toneIndex(schedule: Schedule, count: number) {
  const seed = `${schedule.id ?? ''}${schedule.title}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }

  return Math.abs(hash) % count;
}

function toneBySchedule(schedule: Schedule) {
  if (!schedule.color || !(schedule.color in toneByHex)) {
    if (schedule.type === 'OFFICIAL') {
      return officialToneFallback[toneIndex(schedule, officialToneFallback.length)];
    }

    return defaultTone;
  }

  return toneByHex[schedule.color as keyof typeof toneByHex];
}

export function memberScheduleTone(schedule: Schedule) {
  return toneBySchedule(schedule);
}

export function officialScheduleTone(schedule: Schedule) {
  return toneBySchedule(schedule);
}

export function scheduleLineColor(schedule: Schedule) {
  if (schedule.color && schedule.color in lineByHex) {
    return lineByHex[schedule.color as keyof typeof lineByHex];
  }

  if (schedule.type === 'OFFICIAL') {
    return officialLineFallback[toneIndex(schedule, officialLineFallback.length)];
  }

  return defaultLine;
}

export function weekColorClass(index: number) {
  if (index === 0) return 'text-warning-100';
  if (index === 6) return 'text-primary';
  return 'text-black';
}

export function dateColorClass(date: Date, inMonth: boolean) {
  if (!inMonth) return 'text-schedule-muted';

  const day = date.getDay();

  if (day === 0) return 'text-warning-100';
  if (day === 6) return 'text-primary';
  return 'text-black';
}
