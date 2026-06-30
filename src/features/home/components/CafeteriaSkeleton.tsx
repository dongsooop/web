import { SkeletonText } from '@/components/ui/Skeleton';

export default function CafeteriaSkeleton() {
  return (
    <div className="space-y-7 rounded-2xl bg-white p-5">
      <div className="flex items-center">
        <SkeletonText className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonText className="h-5 w-full" />
        <SkeletonText className="h-5 w-full" />
      </div>
    </div>
  );
}
