import PasswordResetForm from '@/features/auth/components/password-reset/PasswordResetForm';
import PasswordResetProvider from '@/features/auth/providers/PasswordResetProvider';

type PasswordResetPageProps = {
  searchParams?: Promise<{ from?: string }>;
};

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = await searchParams;

  return (
    <main className="max-w-form mx-auto flex min-h-screen w-full flex-col items-center bg-white p-4 pt-30 sm:px-6">
      <PasswordResetProvider>
        <PasswordResetForm from={params?.from} />
      </PasswordResetProvider>
    </main>
  );
}
