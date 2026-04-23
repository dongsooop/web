import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function RestaurantsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-6">
      <WebPlaceholder
        title="맛집"
        description="학교 주변 식당 정보를 모아보고 비교할 수 있어요."
      />
    </div>
  );
}
