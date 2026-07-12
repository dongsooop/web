import AdsenseScript from '@/components/layout/AdsenseScript';
import HomePageContent from './_components/HomePageContent';

export default async function HomePage() {
  return (
    <>
      <AdsenseScript />
      <HomePageContent />
    </>
  );
}
