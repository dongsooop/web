const weekLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

function toDate(value: Date | string) {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

export function formatMonthLabel(value: Date | string) {
  const date = toDate(value);
  return `${date.getMonth() + 1}월`;
}

export function formatDateLabel(value: Date | string) {
  const date = toDate(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function getTodayLabel() {
  const today = new Date();
  const week = weekLabels[today.getDay()];

  return `${today.getMonth() + 1}월 ${today.getDate()}일 ${week}요일`;
}

export function formatYmdDot(date: string) {
  const [year = '', month = '', day = ''] = date.split('T')[0]?.split(' ')[0]?.split('-') ?? [];
  return `${year}.${month}.${day}`;
}
