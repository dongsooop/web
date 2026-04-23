import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function TimetablePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <WebPlaceholder
        title="시간표"
        description="이번 학기 시간표와 수업 일정을 한눈에 확인할 수 있어요."
      />
    </div>
  );
}
