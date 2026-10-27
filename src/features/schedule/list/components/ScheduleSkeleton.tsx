import { Skeleton } from '@/components/ui/Skeleton';
import ScheduleTabs from './ScheduleTabs';

const tabs = [
  { id: 'MEMBER', label: '개인 일정' },
  { id: 'OFFICIAL', label: '학사 일정' },
] as const;

const noop = () => {};

export default function ScheduleSkeleton() {
  return (
    <section className="border-surface-border overflow-hidden rounded-xl border bg-white">
      <div className="flex items-center gap-2 px-5 pt-5 sm:px-6 sm:pt-6">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <ScheduleTabs tab="MEMBER" items={tabs} onChange={noop} />

      <div className="md:grid-cols-schedule grid gap-0">
        <div className="p-4 sm:px-6 sm:py-6">
          <Skeleton className="h-90 rounded-xl sm:h-130" />
        </div>
        <div className="border-surface-border hidden border-t p-4 sm:p-6 md:block md:border-t-0 md:border-l">
          <Skeleton className="h-90 rounded-xl sm:h-130" />
        </div>
      </div>
    </section>
  );
}
