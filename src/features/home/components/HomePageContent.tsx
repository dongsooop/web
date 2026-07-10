'use client';

import HomeHeader from './HomeHeader';
import Timetable from './Timetable';
import MiniCalendar from './MiniCalendar';
import CafeteriaCard from './CafeteriaCard';
import RestaurantBanner from './RestaurantBanner';
import NewNotices from './NewNotices';
import StudyRoomBanner from './StudyRoomBanner';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import HomePageSkeleton from './HomePageSkeleton';
import ChatbotButton from '@/features/chatbot/components/ChatbotButton';

export default function HomePageContent() {
  const {
    home,
    cafeteria,
    isInitialLoading,
    isHomeLoading,
    isHomeError,
    homeErrorMessage,
    isCafeteriaLoading,
    isCafeteriaError,
    cafeteriaErrorMessage,
  } = useHomeData();

  if (isHomeError) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-body text-gray5">{homeErrorMessage}</p>
      </div>
    );
  }

  if (isInitialLoading || isHomeLoading || !home) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="h-full lg:row-span-2">
            <Timetable timetable={home.timetable} />
          </div>

          <div className="h-full">
            <CafeteriaCard
              menus={cafeteria ?? []}
              isLoading={isCafeteriaLoading}
              errorMessage={isCafeteriaError ? cafeteriaErrorMessage : null}
            />
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
            <NewNotices notices={home.notices} />
          </div>
          <div className="min-w-0">{/* Eclass 들어갈 위치 */}</div>
        </div>
      </div>

      <ChatbotButton />
    </div>
  );
}
