import AdsenseScript from '@/components/layout/AdsenseScript';
import MyPageContent from './_components/MyPageContent';

export default function MyPagePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-4 lg:min-h-[calc(100dvh-3rem)]">
      <AdsenseScript />
      <MyPageContent />
    </div>
  );
}
