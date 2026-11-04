import type { ReactNode } from 'react';
import { SkeletonText } from './Skeleton';

/** Keep the surrounding card and navigation visible while only its data is pending. */
export default function DataRegion({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  if (error)
    return (
      <div role="status" className="home-empty">
        {error}
      </div>
    );
  if (loading)
    return (
      <div
        role="status"
        aria-label="데이터 불러오는 중"
        aria-busy="true"
        className="space-y-3 py-5"
      >
        <SkeletonText className="h-5 w-3/4" />
        <SkeletonText className="w-1/2" />
      </div>
    );
  return children;
}
