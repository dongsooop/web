import { Skeleton } from '@/components/ui/Skeleton';

function MenuSkeleton({ rows }: { rows: number }) {
  return (
    <section className="home-card" aria-hidden="true">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <div className="border-surface-border mt-5 space-y-4 border-t pt-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MyPageSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        마이페이지를 불러오는 중이에요.
      </span>
      <div className="flex flex-col gap-5" aria-busy="true">
        <section className="home-card" aria-hidden="true">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <div className="border-surface-border mt-5 flex items-center gap-4 border-t pt-5">
            <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-32 rounded" />
            </div>
          </div>
        </section>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <MenuSkeleton rows={2} />
          <MenuSkeleton rows={3} />
        </div>
      </div>
    </>
  );
}
