'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function RestaurantCardSkeleton() {
  return (
    <article
      className="border-surface-border flex h-full flex-col rounded-xl border bg-white p-4 sm:p-5"
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-5 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <Skeleton className="mt-5 h-4 w-1/3 rounded" />
    </article>
  );
}
