export type DailyMealDto = {
  date: string;
  dayOfWeek: string;
  koreanMenu: string; 
};

export type CafeteriaResponse = {
  startDate: string;
  endDate: string;
  dailyMeals: DailyMealDto[];
};