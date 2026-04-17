'use client';

import HomeHeader from './HomeHeader';
import Timetable from './Timetable';
import MiniCalendar from './MiniCalendar';
import CafeteriaCard from './CafeteriaCard';
import RestaurantBanner from './RestaurantBanner';
import NewNotices from './NewNotices';
import PopularRecruits from './PopularRecruits';
import StudyRoomBanner from './StudyRoomBanner';
import { useHomePageData } from '@/features/home/hooks/useHomePageData';

function HomePageLoading() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:items-stretch">
          <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl" />

          <div className="flex flex-col gap-4 lg:h-full">
            <div className="border-gray2 bg-gray1 animate-pulse rounded-2xl lg:min-h-0 lg:flex-[2]" />
            <div className="border-gray2 bg-gray1 animate-pulse rounded-2xl lg:min-h-0 lg:flex-1" />
            <div className="border-gray2 bg-gray1 animate-pulse rounded-2xl lg:min-h-0 lg:flex-1" />
          </div>

          <div className="border-gray2 bg-gray1 h-full animate-pulse rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="bg-gray1 h-72 animate-pulse rounded-2xl" />
          <div className="bg-gray1 h-72 animate-pulse rounded-2xl" />
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

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:items-stretch">
          <div className="h-full">
            <Timetable timetable={data.home.timetable} />
          </div>

          <div className="flex flex-col gap-4 lg:h-full">
            <div className="lg:min-h-0 lg:flex-[2]">
              <CafeteriaCard menus={data.cafeteria} />
            </div>

            <div className="lg:min-h-0 lg:flex-1">
              <RestaurantBanner />
            </div>

            <div className="lg:min-h-0 lg:flex-1">
              <StudyRoomBanner />
            </div>
          </div>

          <div className="h-full">
            <MiniCalendar />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <NewNotices notices={data.home.notices} />
          </div>
          {/* Eclass 들어갈 위치 */}
          <div className="min-w-0">
            <PopularRecruits popularRecruitments={data.home.popularRecruitments} />
          </div>
        </div>
      </div>
    </div>
  );
}
