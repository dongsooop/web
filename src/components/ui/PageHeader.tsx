import { MonitorSmartphone } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  description: string;
  isPreparing?: boolean;
};

export default function PageHeader({
  title,
  description,
  isPreparing = false,
}: PageHeaderProps) {
  return (
    <section className="flex w-full max-w-[1440px] flex-col gap-3 px-1 pt-1">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-title mr-1 font-bold text-black">{title}</h1>
        {isPreparing && (
          <span className="border-primary/15 bg-primary/5 text-normal text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold">
            <MonitorSmartphone className="text-large h-4 w-4" />웹 준비 중
          </span>
        )}
      </div>
      <p className="text-large text-gray6">{description}</p>
    </section>
  );
}
