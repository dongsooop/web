import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function MyPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="마이페이지"
        description="내 정보와 서비스 이용 내역을 한곳에서 관리할 수 있어요."
      />
    </div>
  );
}
