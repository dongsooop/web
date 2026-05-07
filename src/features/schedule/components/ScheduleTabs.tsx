type TabId = 'MEMBER' | 'OFFICIAL';

type ScheduleTabsProps = {
  tab: TabId;
  items: readonly { id: TabId; label: string }[];
  onChange: (tab: TabId) => void;
};

export default function ScheduleTabs({ tab, items, onChange }: ScheduleTabsProps) {
  return (
    <div className="border-gray2 border-b">
      <div className="flex">
        {items.map((item) => {
          const isActive = item.id === tab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                'flex h-12 flex-1 cursor-pointer items-center justify-center border-b-2 px-0 py-0 text-sm font-semibold transition sm:h-14 sm:min-w-28 sm:flex-none',
                isActive
                  ? 'border-primary text-primary'
                  : 'text-gray5 border-transparent hover:text-black',
              ].join(' ')}
            >
              <span className="block px-4">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
