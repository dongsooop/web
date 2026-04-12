import AppShell from '@/components/layout/AppShell';
import HomePageContent from './_components/HomePageContent';

export default async function HomePage() {
  return (
    <AppShell>
      <HomePageContent />
    </AppShell>
  );
}
