const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function toTimeKey(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getWeekNumber(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));

  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getWeekKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-W${getWeekNumber(date)}`;
}

export function getTodayLabel() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = dayLabels[today.getDay()];

  return `${month}월 ${date}일 (${dayOfWeek})`;
}

export function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export function formatDateWithDayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dayOfWeek = dayLabels[new Date(year, month - 1, day).getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

export function formatMonthLabel(date: Date) {
  return `${date.getMonth() + 1}월`;
}
