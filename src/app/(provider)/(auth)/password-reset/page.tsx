import PasswordResetForm from './_components/PasswordResetForm';

type PasswordResetPageProps = {
  searchParams?: Promise<{ from?: string }>;
};

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = await searchParams;

  return (
    <main className="max-w-form mx-auto flex min-h-screen w-full flex-col items-center bg-white p-4 pt-30 sm:px-6 md:max-w-md">
      <PasswordResetForm from={params?.from} />
    </main>
  );
}
