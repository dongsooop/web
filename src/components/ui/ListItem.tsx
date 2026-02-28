import Link from 'next/link';
import CommonTag from './CommonTag';

export type ListItemTag = {
  label: string;
  tone?: 'blue' | 'gray' | 'red' | 'yellow' | 'outline';
};

type ListItemProps = {
  href: string;
  title: string;
  tags: ListItemTag[];
  minHeightClassName?: string;
};

export default function ListItem({
  href,
  title,
  tags,
  minHeightClassName = 'min-h-[96px]',
}: ListItemProps) {
  return (
    <Link href={href} className={`group block ${minHeightClassName} py-4`}>
      <div className="text-normal line-clamp-2 font-semibold text-black underline-offset-2 group-hover:underline">
        {title}
      </div>

      <div className="mt-3 flex h-[28px] flex-wrap items-start gap-2 overflow-hidden">
        {tags.map((t, idx) => (
          <CommonTag key={`${t.label}-${idx}`} label={t.label} tone={t.tone} />
        ))}
      </div>
    </Link>
  );
}
