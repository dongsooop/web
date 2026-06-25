'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function RestaurantCardSkeleton() {
  return (
    <article className="relative min-h-14 bg-white py-5 sm:px-5" aria-hidden="true">
      <Skeleton className="block h-24 w-full rounded-xl" />
    </article>
  );
}
