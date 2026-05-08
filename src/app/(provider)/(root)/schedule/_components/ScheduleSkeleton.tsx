import { Skeleton } from '@/components/ui/Skeleton';
import ScheduleTabs from './ScheduleTabs';

const tabs = [
  { id: 'MEMBER', label: '개인 일정' },
  { id: 'OFFICIAL', label: '학사 일정' },
] as const;

const noop = () => {};

export default function ScheduleSkeleton() {
  return (
    <section className="sm:border-gray2 sm:shadow-schedule-panel overflow-hidden rounded-2xl bg-white sm:border">
      <ScheduleTabs tab="MEMBER" items={tabs} onChange={noop} />

      <div className="lg:grid-cols-schedule grid gap-0">
        <div className="p-4 sm:px-7 sm:py-6">
          <Skeleton className="h-90 rounded-2xl sm:h-130" />
        </div>
        <div className="border-gray2 border-t p-4 sm:p-6 lg:border-t-0 lg:border-l">
          <Skeleton className="h-90 rounded-2xl sm:h-130" />
        </div>
      </div>
    </section>
  );
}
