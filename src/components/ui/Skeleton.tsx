type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div aria-hidden="true" className={`skeleton-base ${className}`.trim()} />;
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 rounded-md ${className}`.trim()} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`.trim()} />;
}

export function SkeletonIconBox({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-10 w-10 rounded-xl ${className}`.trim()} />;
}

export function SkeletonButton({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-8 w-8 rounded-lg ${className}`.trim()} />;
}
