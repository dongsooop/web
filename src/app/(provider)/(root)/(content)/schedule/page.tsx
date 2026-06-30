import ScheduleBoard from './list/_components/ScheduleBoard';

type SchedulePageProps = {
  searchParams?: Promise<{
    month?: string | string[];
  }>;
};

function normalizeMonth(month?: string | string[]) {
  if (Array.isArray(month)) {
    return month[0];
  }

  return month;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const month = normalizeMonth(params?.month);

  return <ScheduleBoard month={month} />;
}
