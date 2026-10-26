import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';

export default function HomePageSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        홈 화면을 불러오는 중이에요.
      </span>
      <div className="home-dashboard" aria-hidden="true">
        <div className="space-y-4 py-4">
          <SkeletonText className="h-3 w-28" />
          <SkeletonText className="h-10 w-72" />
          <SkeletonText className="h-4 w-52" />
        </div>
        <div className="home-quick-links">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="home-main-grid">
          <div className="home-main-left">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className="home-main-right">
            <Skeleton className="h-[440px] rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </>
  );
}
