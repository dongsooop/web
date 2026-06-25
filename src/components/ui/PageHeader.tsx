'use client';

import { ArrowLeft, MonitorSmartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PageHeaderProps = {
  title: string;
  description?: string;
  isPreparing?: boolean;
  showBackButton?: boolean;
};

export default function PageHeader({
  title,
  description,
  isPreparing = false,
  showBackButton = false,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <section className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button
            type="button"
            aria-label="이전 화면으로 돌아가기"
            onClick={() => router.back()}
            className="hover:bg-gray1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
          >
            <ArrowLeft className="h-5 w-5 text-black" />
          </button>
        ) : null}

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="text-heading sm:text-title min-w-0 font-bold text-black">{title}</h1>
          {isPreparing && (
            <span className="border-primary/15 bg-primary/5 text-primary text-caption inline-flex items-center gap-1 rounded-full border px-2 py-1 sm:gap-2 sm:px-3 sm:text-base">
              <MonitorSmartphone className="h-3 w-3 sm:h-4 sm:w-4" />웹 준비 중
            </span>
          )}
        </div>
      </div>

      {description ? (
        <p className={`text-bodySm text-gray6 sm:text-body ${showBackButton ? 'px-2' : ''}`.trim()}>
          {description}
        </p>
      ) : null}
    </section>
  );
}
