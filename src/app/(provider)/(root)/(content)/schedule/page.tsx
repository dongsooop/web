import ScheduleBoard from './list/_components/ScheduleBoard';

type SchedulePageProps = {
  searchParams?: Promise<{
    month?: string;
  }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = searchParams ? await searchParams : undefined;

  return <ScheduleBoard month={params?.month} />;
}
