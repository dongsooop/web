export default function HomeHeader() {
  const dateLabel = '5월 21일 (화)';

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
