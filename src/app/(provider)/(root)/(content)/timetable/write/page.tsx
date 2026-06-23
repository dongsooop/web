import TimetableWritePage from './_components/TimetableWritePage';

type TimetableWriteRouteProps = {
  searchParams?: Promise<{ id?: string }>;
};

export default async function TimetableWriteRoute({ searchParams }: TimetableWriteRouteProps) {
  const params = await searchParams;

  return <TimetableWritePage id={params?.id} />;
}
