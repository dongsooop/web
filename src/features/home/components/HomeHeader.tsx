import { getTodayLabel } from '@/utils/date';
import { useAuth } from '@/features/auth/hooks/useAuth';

type HomeHeaderProps = {
  timetableCount?: number;
  scheduleCount?: number;
};

export default function HomeHeader({ timetableCount = 0, scheduleCount = 0 }: HomeHeaderProps) {
  const dateLabel = getTodayLabel();
  const { user } = useAuth();

  const headline =
    scheduleCount > 0
      ? `오늘 놓치면 안 될 일정이 ${scheduleCount}개 있어요`
      : timetableCount > 0
        ? `오늘 수업 ${timetableCount}개가 예정되어 있어요`
        : '오늘은 학사 일정이 없어요';

  return (
    <header className="max-w-3xl py-2 lg:py-4">
      {user ? (
        <p className="text-primary mb-2 text-sm font-semibold">{user.nickname}님, 안녕하세요</p>
      ) : null}
      <p className="text-surface-muted text-sm font-semibold">{dateLabel}</p>
      <h1 className="mt-3 text-[2rem] leading-[1.25] font-bold tracking-[-0.035em] text-black sm:text-4xl lg:text-[2.75rem]">
        {headline}
      </h1>
    </header>
  );
}
