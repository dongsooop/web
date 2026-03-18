export type DailyMealUiModel = {
  date: string;
  dayOfWeek: string;
  menuList: string[];
};

export type CafeteriaUiModel = {
  formattedPeriod: string;
  dailyMeals: DailyMealUiModel[];
};