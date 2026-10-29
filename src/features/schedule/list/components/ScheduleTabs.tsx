export type TabId = 'MEMBER' | 'OFFICIAL';

type ScheduleTabsProps = {
  tab: TabId;
  items: readonly { id: TabId; label: string }[];
  onChange: (tab: TabId) => void;
};

export default function ScheduleTabs({ tab, items, onChange }: ScheduleTabsProps) {
  return (
    <div className="border-surface-border mx-5 mt-3 border-b sm:mx-6">
      <div className="flex gap-5" role="group" aria-label="일정 분류 필터">
        {items.map((item) => {
          const isActive = item.id === tab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={isActive}
              className={[
                'text-bodySm focus-visible:ring-primary flex min-h-12 cursor-pointer items-center justify-center border-b-2 px-1 font-semibold transition-colors focus-visible:rounded-md focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'border-primary text-primary'
                  : 'text-surface-muted border-transparent hover:text-black',
              ].join(' ')}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
