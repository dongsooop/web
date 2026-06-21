'use client';

import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/Skeleton';

export function RestaurantSkeleton() {
  return (
    <article className="border-gray2 min-h-14 rounded-2xl border bg-white px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <SkeletonCircle className="h-14 w-14 sm:h-16 sm:w-16" />
        <div className="flex-1 space-y-3">
          <SkeletonText className="h-6 w-32" />
          <SkeletonText className="w-44" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-14 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
        <SkeletonCircle className="h-11 w-11" />
      </div>
    </article>
  );
}
