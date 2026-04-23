import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function MyPageFeedbackPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-6">
      <WebPlaceholder
        title="피드백"
        description="서비스 이용 중 불편한 점이나 개선 의견을 전달할 수 있어요."
      />
    </div>
  );
}
