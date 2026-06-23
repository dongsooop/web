import PasswordResetForm from './_components/PasswordResetForm';

type PasswordResetPageProps = {
  searchParams?: Promise<{ from?: string }>;
};

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-white px-5 pt-20">
      <PasswordResetForm from={params?.from} />
    </main>
  );
}
