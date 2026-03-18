import { CafeteriaResponse } from './types';

export const mapCafeteriaResponseToUi = (dto: CafeteriaResponse): string[] => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return weekDates.map((dateStr, index) => {
    const meal = dto?.dailyMeals?.find((m) => m.date === dateStr);
    const dayOfWeek = index + 1;
    const isWeekend = dayOfWeek >= 6;
    const rawMenu = meal?.koreanMenu?.trim() || '';
    const isTooShort = rawMenu.length < 10;

    if (isWeekend || isTooShort || rawMenu === '식단 정보 없음') {
      return '오늘은 학식이 제공되지 않아요!';
    }

    return rawMenu;
  });
};
