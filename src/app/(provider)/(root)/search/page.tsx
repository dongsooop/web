import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function SearchPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-6">
      <WebPlaceholder
        title="검색"
        description="필요한 정보를 빠르게 찾아볼 수 있어요."
      />
    </div>
  );
}
