type TabId = 'MEMBER' | 'OFFICIAL';

type ScheduleTabsProps = {
  tab: TabId;
  items: readonly { id: TabId; label: string }[];
  onChange: (tab: TabId) => void;
};

export default function ScheduleTabs({ tab, items, onChange }: ScheduleTabsProps) {
  return (
    <div className="border-gray2 flex border-b px-4 pt-3 sm:px-7 sm:pt-5">
      {items.map((item) => {
        const isActive = item.id === tab;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={[
              'text-small flex flex-1 items-center justify-center border-b-2 px-2 pb-3 font-semibold transition sm:flex-none sm:justify-start sm:px-3 sm:pb-4 sm:text-normal',
              isActive ? 'border-primary text-primary' : 'border-transparent text-gray5 hover:text-black',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
