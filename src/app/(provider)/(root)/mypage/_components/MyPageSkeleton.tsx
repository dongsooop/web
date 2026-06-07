import { Fragment } from 'react';
import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonIconBox,
  SkeletonText,
} from '@/components/ui/Skeleton';

function SkeletonRow({ descriptionWidth }: { descriptionWidth: string }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <SkeletonIconBox />
        <div className="space-y-2">
          <SkeletonText className="h-6 w-22" />
          <SkeletonText className={`hidden ${descriptionWidth} sm:block`} />
        </div>
      </div>
      <SkeletonButton />
    </div>
  );
}

function SkeletonSection({ descriptionWidths }: { descriptionWidths: string[] }) {
  return (
    <section className="space-y-3">
      <div className="rounded-lg bg-white p-4">
        <SkeletonText className="mb-4 h-5 w-20 px-1" />
        {descriptionWidths.map((descriptionWidth, index) => (
          <Fragment key={index}>
            {index > 0 ? <div className="bg-gray2 m-3 h-px" /> : null}
            <SkeletonRow descriptionWidth={descriptionWidth} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default function MyPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-white p-4 py-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <SkeletonCircle className="h-14 w-14" />
          </div>
          <div className="flex-1 space-y-2">
            <SkeletonText className="h-6 w-20" />
            <SkeletonText className="h-5 w-34 rounded-full" />
          </div>
        </div>
      </div>

      <SkeletonSection descriptionWidths={['w-52', 'w-52']} />
      <SkeletonSection descriptionWidths={['w-52', 'w-52', 'w-52']} />
    </div>
  );
}
