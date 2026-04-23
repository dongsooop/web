import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function SearchPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="검색"
        description="필요한 정보를 빠르게 찾아볼 수 있어요."
      />
    </div>
  );
}
