import { MonitorSmartphone } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  description: string;
  isPreparing?: boolean;
};

export default function PageHeader({ title, description, isPreparing = false }: PageHeaderProps) {
  return (
    <section className="flex w-full max-w-[1440px] flex-col gap-3 pt-1">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="sm:text-title text-large mr-0.5 font-bold text-black">{title}</h1>
        {isPreparing && (
          <span className="border-primary/15 bg-primary/5 text-primary text-small inline-flex items-center gap-1 rounded-full border px-2 py-1 sm:gap-2 sm:px-3 sm:text-base">
            <MonitorSmartphone className="h-3 w-3 sm:h-4 sm:w-4" />웹 준비 중
          </span>
        )}
      </div>
      <p className="text-gray6 text-sm sm:text-base">{description}</p>
    </section>
  );
}
