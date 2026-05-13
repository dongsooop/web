import ScheduleWritePage from './_components/ScheduleWritePage';

type ScheduleWriteRouteProps = {
  searchParams?: Promise<{ date?: string }>;
};

export default async function ScheduleWriteRoute({ searchParams }: ScheduleWriteRouteProps) {
  const params = await searchParams;

  return <ScheduleWritePage date={params?.date} />;
}
