import HomeHeader from './_components/HomeHeader';
import Timetable from './_components/Timetable';
import MiniCalendar from './_components/MiniCalendar';
import CafeteriaCard from './_components/CafeteriaCard';
import RestaurantBanner from './_components/RestaurantBanner';
import NewNotices from './_components/NewNotices';
import PopularRecruits from './_components/PopularRecruits';
import StudyRoomBanner from './_components/StudyRoomBanner';
import AppShell from '@/components/layout/AppShell';

export default async function HomePage() {
  return (
    <AppShell>
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
          <HomeHeader />

          <div className="grid grid-cols-1 gap-4 lg:min-h-[320px] lg:grid-cols-3 lg:grid-rows-2 lg:items-stretch">
            <div className="h-full lg:row-span-2">
              <Timetable />
            </div>

            <div className="h-full lg:row-span-2">
              <div className="grid h-full grid-rows-[2fr_1fr] gap-4">
                <div className="h-full">
                  <CafeteriaCard />
                </div>
                <div className="h-full">
                  <StudyRoomBanner />
                </div>
              </div>
            </div>

            <div className="h-full lg:row-span-2">
              <MiniCalendar />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <RestaurantBanner />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <NewNotices />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <PopularRecruits />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
