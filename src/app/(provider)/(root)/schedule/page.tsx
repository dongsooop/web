import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function SchedulePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="일정 관리"
        description="학사 일정과 개인 일정을 확인하고 관리할 수 있어요."
      />
    </div>
  );
}
