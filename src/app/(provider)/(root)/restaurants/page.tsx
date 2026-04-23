import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function RestaurantsPage() {
  // TODO: 다음 브랜치에서 라우트 폴더명을 `restaurant`로 변경
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="맛집"
        description="학교 주변 식당 정보를 모아보고 비교할 수 있어요."
      />
    </div>
  );
}
