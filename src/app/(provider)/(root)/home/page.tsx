import AdsenseScript from '@/components/layout/AdsenseScript';
import HomePageContent from '@/features/home/components/HomePageContent';

export default async function HomePage() {
  return (
    <>
      <AdsenseScript />
      <HomePageContent />
    </>
  );
}
