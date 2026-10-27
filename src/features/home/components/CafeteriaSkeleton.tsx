import { Skeleton } from '@/components/ui/Skeleton';

export default function CafeteriaSkeleton() {
  return (
    <section className="home-card home-lunch" aria-label="학식 정보를 불러오는 중" aria-busy="true">
      <Skeleton className="h-6 w-28 rounded" />
      <Skeleton className="mt-5 h-40 rounded-xl" />
      <Skeleton className="mt-5 h-4 w-20 rounded" />
      <Skeleton className="mt-3 h-6 w-4/5 rounded" />
      <Skeleton className="mt-3 h-4 w-3/5 rounded" />
    </section>
  );
}
