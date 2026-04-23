import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function MyPageSocialConnectionsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-6">
      <WebPlaceholder
        title="소셜 계정 연동"
        description="연결된 계정을 확인하고 로그인 연동 상태를 관리할 수 있어요."
      />
    </div>
  );
}
