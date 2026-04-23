import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

type ManagementLinkCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function ManagementLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: ManagementLinkCardProps) {
  return (
    <Link
      href={href}
      className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-lg"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-normal font-semibold text-black">{title}</div>
          <p className="text-small text-gray5 mt-1 break-keep">{description}</p>
        </div>
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        <ChevronRight className="text-gray4 h-5 w-5" />
      </div>
    </Link>
  );
}
