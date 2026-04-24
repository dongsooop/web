import {
  Skeleton,
  SkeletonButton,
  SkeletonText,
} from '@/components/ui/Skeleton';
import HomeHeader from './HomeHeader';

function HomeSectionCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={`rounded-2xl bg-white p-5 ${className ?? ''}`.trim()}>{children}</div>;
}

function TimetableSkeleton() {
  return (
    <HomeSectionCard className="flex flex-col gap-4 lg:row-span-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <SkeletonText className="h-5 w-24" />
          <SkeletonText className="w-32" />
        </div>
        <SkeletonButton />
      </div>

      <div className="bg-primary/5 flex flex-1 flex-col gap-2 rounded-xl p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[88px_1fr] items-center gap-3">
            <div className="space-y-2 py-1">
              <SkeletonText className="w-12" />
              <SkeletonText className="w-12" />
            </div>
            <Skeleton className="h-[50px] rounded-lg" />
          </div>
        ))}
      </div>
    </HomeSectionCard>
  );
}

function CafeteriaSkeleton() {
  return (
    <HomeSectionCard className="space-y-7">
      <div className="flex items-center">
        <SkeletonText className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonText className="h-5 w-full" />
        <SkeletonText className="h-5 w-full" />
      </div>
    </HomeSectionCard>
  );
}

function CalendarSkeleton() {
  return (
    <HomeSectionCard className="flex flex-col gap-7 lg:row-span-3">
      <div className="flex items-center justify-between">
        <SkeletonText className="h-8 w-16" />
        <div className="flex gap-1">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SkeletonText className="h-5 flex-1" />
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
      <div className="bg-gray2 h-px w-full" />
      <div className="mt-auto flex-1">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </HomeSectionCard>
  );
}

function StudyRoomSkeleton() {
  return (
    <HomeSectionCard className="flex items-center justify-between gap-4 rounded-lg p-4 shadow-sm">
      <div className="flex-1 items-center gap-6">
        <div className="w-full space-y-2">
          <SkeletonText className="h-6 w-4/5" />
          <SkeletonText className="h-6 w-3/5" />
        </div>
      </div>
    </HomeSectionCard>
  );
}

function RestaurantBannerSkeleton() {
  return <Skeleton className="min-h-16 w-full rounded-2xl lg:h-full" />;
}

function NoticesSkeleton() {
  return (
    <HomeSectionCard>
      <div className="flex items-center justify-between px-3">
        <SkeletonText className="h-8 w-24" />
        <SkeletonButton />
      </div>

      <div className="border-gray2 mt-4 rounded-2xl bg-white px-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={index === 0 ? 'px-2 py-4' : 'border-gray2 border-t px-2 py-4'}
          >
            <div className="space-y-2">
              <SkeletonText className="mb-4 h-6 w-6/7" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </HomeSectionCard>
  );
}

export default function HomePageSkeleton() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4">
        <HomeHeader />
        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-3 lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <TimetableSkeleton />
          <CafeteriaSkeleton />
          <CalendarSkeleton />
          <StudyRoomSkeleton />
          <div className="lg:col-span-2">
            <RestaurantBannerSkeleton />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <NoticesSkeleton />
        </div>
      </div>
    </div>
  );
}
