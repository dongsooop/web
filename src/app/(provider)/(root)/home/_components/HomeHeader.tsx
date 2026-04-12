import { getTodayLabel } from '@/utils/formatter/date';

export default function HomeHeader() {
  const dateLabel = getTodayLabel();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-title font-bold text-black">{dateLabel}</div>
        </div>
      </div>
    </div>
  );
}
