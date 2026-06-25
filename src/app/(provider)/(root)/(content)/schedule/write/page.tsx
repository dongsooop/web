import ScheduleWritePage from './_components/ScheduleWritePage';

type ScheduleWriteRouteProps = {
  searchParams?: Promise<{ date?: string; id?: string; month?: string }>;
};

export default async function ScheduleWriteRoute({ searchParams }: ScheduleWriteRouteProps) {
  const params = await searchParams;

  return <ScheduleWritePage date={params?.date} id={params?.id} month={params?.month} />;
}
