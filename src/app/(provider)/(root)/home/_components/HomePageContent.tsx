'use client';

import HomeHeader from './HomeHeader';
import Timetable from './Timetable';
import MiniCalendar from './MiniCalendar';
import CafeteriaCard from './CafeteriaCard';
import RestaurantBanner from './RestaurantBanner';
import NewNotices from './NewNotices';
import EclassAssignment from './EclassAssignment';
import StudyRoomBanner from './StudyRoomBanner';
import { useHomePageData } from '@/features/home/hooks/useHomePageData';

function HomePageLoading() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[320px] lg:grid-cols-3 lg:grid-rows-2 lg:items-stretch">
          <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl lg:row-span-2" />
          <div className="grid h-full grid-rows-[2fr_1fr] gap-4 lg:row-span-2">
            <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl" />
            <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl" />
          </div>
          <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl lg:row-span-2" />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="bg-gray1 col-span-12 h-28 animate-pulse rounded-2xl" />
          <div className="bg-gray1 col-span-12 h-72 animate-pulse rounded-2xl lg:col-span-6" />
          <div className="bg-gray1 col-span-12 h-72 animate-pulse rounded-2xl lg:col-span-6" />
        </div>
      </div>
    </div>
  );
}

export default function HomePageContent() {
  const { data, isLoading, isError, displayErrorMessage } = useHomePageData();

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-normal text-gray5">{displayErrorMessage}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <HomePageLoading />;
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[320px] lg:grid-cols-3 lg:grid-rows-2 lg:items-stretch">
          <div className="h-full lg:row-span-2">
            <Timetable timetable={data.home.timetable} />
          </div>

          <div className="h-full lg:row-span-2">
            <div className="grid h-full grid-rows-[2fr_1fr] gap-4">
              <div className="h-full">
                <CafeteriaCard menus={data.cafeteria} />
              </div>
              <div className="h-full">
                <StudyRoomBanner />
              </div>
            </div>
          </div>

          <div className="h-full lg:row-span-2">
            <MiniCalendar schedules={data.home.schedules} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <RestaurantBanner />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <NewNotices notices={data.home.notices} />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <EclassAssignment />
          </div>
        </div>
      </div>
    </div>
  );
}
