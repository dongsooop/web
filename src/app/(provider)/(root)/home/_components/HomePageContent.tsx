'use client';

import HomeHeader from './HomeHeader';
import Timetable from './Timetable';
import MiniCalendar from './MiniCalendar';
import CafeteriaCard from './CafeteriaCard';
import RestaurantBanner from './RestaurantBanner';
import NewNotices from './NewNotices';
import HomeEclassCard from './HomeEclassCard';
import StudyRoomBanner from './StudyRoomBanner';
import { useHomePageDataQuery } from '@/features/home/hooks/useHomePageDataQuery';
import HomePageSkeleton from './HomePageSkeleton';

export default function HomePageContent() {
  const { data, isLoading, isError, displayErrorMessage } = useHomePageDataQuery();

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-body text-gray5">{displayErrorMessage}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 sm:gap-4 lg:px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="order-1 h-full min-w-0 lg:order-none lg:row-span-2">
            <Timetable timetable={data.home.timetable} />
          </div>

          <div className="order-3 h-full min-w-0 lg:order-none">
            <HomeEclassCard eclass={data.home.eclass} />
          </div>

          <div className="order-2 h-full min-w-0 lg:order-none lg:row-span-3">
            <MiniCalendar />
          </div>

          <div className="order-5 h-full min-w-0 lg:order-none">
            <StudyRoomBanner />
          </div>

          <div className="order-6 h-full min-w-0 lg:order-none">
            <RestaurantBanner />
          </div>

          <div className="order-4 h-full min-w-0 lg:order-none">
            <CafeteriaCard menus={data.cafeteria} />
          </div>
        </div>

        <div className="min-w-0">
          <NewNotices notices={data.home.notices} />
        </div>
      </div>
    </div>
  );
}
