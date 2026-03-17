export const getTodayLabel = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  
  return `${month}월 ${date}일 (${dayOfWeek})`;
};