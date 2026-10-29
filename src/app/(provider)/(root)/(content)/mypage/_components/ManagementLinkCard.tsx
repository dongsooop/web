import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

type ManagementLinkCardProps = {
  href?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function ManagementLinkCard({
  href,
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
}: ManagementLinkCardProps) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-surface-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sky-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <strong className="text-bodySm group-hover:text-primary block font-semibold text-black transition-colors">
            {title}
          </strong>
          <p className="text-caption text-surface-muted mt-1 break-keep">{description}</p>
        </div>
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        <ChevronRight
          className="text-surface-muted group-hover:text-primary h-4 w-4 transition-colors"
          aria-hidden="true"
        />
      </div>
    </>
  );

  const className =
    'group hover:bg-surface-soft focus-visible:ring-primary flex min-h-20 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none';

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} appearance-none bg-transparent disabled:cursor-wait disabled:opacity-60`}
    >
      {content}
    </button>
  );
}
