export const getTodayLabel = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  
  return `${month}월 ${date}일 (${dayOfWeek})`;
};

export function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export function formatMonthLabel(date: Date) {
  return `${date.getMonth() + 1}월`;
}
