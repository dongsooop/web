import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function SettingPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="설정"
        description="계정, 앱 사용 환경을 원하는 방식으로 관리할 수 있어요."
      />
    </div>
  );
}
