'use client';

import HomeHeader from './HomeHeader';
import Timetable from './Timetable';
import MiniCalendar from './MiniCalendar';
import CafeteriaCard from './CafeteriaCard';
import RestaurantBanner from './RestaurantBanner';
import NewNotices from './NewNotices';
import StudyRoomBanner from './StudyRoomBanner';
import { useHomePageDataQuery } from '@/features/home/hooks/useHomePageDataQuery';
import HomePageSkeleton from './HomePageSkeleton';

export default function HomePageContent() {
  const { data, isLoading, isError, displayErrorMessage } = useHomePageDataQuery();

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-normal text-gray5">{displayErrorMessage}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="h-full lg:row-span-2">
            <Timetable timetable={data.home.timetable} />
          </div>

          <div className="h-full">
            <CafeteriaCard menus={data.cafeteria} />
          </div>

          <div className="h-full lg:row-span-3">
            <MiniCalendar />
          </div>

          <div className="h-full">
            <StudyRoomBanner />
          </div>

          <div className="h-full lg:col-span-2">
            <RestaurantBanner />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="min-w-0">
            <NewNotices notices={data.home.notices} />
          </div>
          <div className="min-w-0">{/* Eclass 들어갈 위치 */}</div>
        </div>
      </div>
    </div>
  );
}
